import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import Goal from '@/models/Goal';
import { getSessionUser } from '@/lib/auth';
import { validateAmount } from '@/lib/validateAmount';

export async function POST(req) {
  try {
    const session = getSessionUser(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { amount } = await req.json();
    const amtCheck = validateAmount(amount);
    if (!amtCheck.valid) return NextResponse.json({ error: 'INVALID_AMOUNT', message: amtCheck.error }, { status: 400 });

    await connectToDatabase();

    const user_id = session.userId;
    const account = await Account.findOne({ user_id });
    if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

    const goals = await Goal.find({ user_id });

    let total_required_daily_saving = 0;
    if (goals.length > 0) {
      const total_saved = account.savings_wallet + account.cash_savings + account.investment_balance;
      for (const goal of goals) {
        const days_passed = Math.floor((new Date() - new Date(goal.created_at)) / (1000 * 60 * 60 * 24));
        const days_left   = Math.max(1, goal.duration_days - days_passed);
        const remaining   = Math.max(0, goal.target_amount - total_saved);
        total_required_daily_saving += remaining / days_left;
      }
    }

    let suggested_saving, mode, message;

    if (amount <= 500) {
      suggested_saving = amount * 0.05;
      mode    = 'steadyMode';
      message = 'steadyMsg';
    } else if (amount <= 1500) {
      suggested_saving = amount * 0.15;
      mode    = 'growthMode';
      message = 'growthMsg';
    } else {
      suggested_saving = amount * 0.25;
      mode    = 'abundanceMode';
      message = 'abundanceMsg';
    }

    account.main_balance += amount;
    await account.save();

    await Transaction.create({ user_id, type: 'income', amount, source: 'external' });

    return NextResponse.json({
      success: true,
      message: 'Income added',
      suggested_saving: Math.ceil(suggested_saving),
      new_balance: account.main_balance,
      mode,
      mode_message: message,
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
