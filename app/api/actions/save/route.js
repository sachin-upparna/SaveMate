import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import Goal from '@/models/Goal';
import User from '@/models/User';
import { getSessionUser } from '@/lib/auth';
import { validateAmount } from '@/lib/validateAmount';
import { sendEmail } from '@/lib/email';

export async function POST(req) {
  try {
    const session = getSessionUser(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { amount, source, goal_id } = await req.json();
    const amtCheck = validateAmount(amount);
    if (!amtCheck.valid) return NextResponse.json({ error: 'INVALID_AMOUNT', message: amtCheck.error }, { status: 400 });

    await connectToDatabase();

    const user_id = session.userId;
    const account = await Account.findOne({ user_id });
    if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

    const now = new Date();
    if (!account.lastActionAt) {
      account.currentStreak = 1;
      account.lastActionAt = now;
    } else {
      const diffMins = Math.floor((now - account.lastActionAt) / 60000);
      
      if (diffMins >= 60 && diffMins <= 90) {
        account.currentStreak += 1;
        account.lastActionAt = now;
      } else if (diffMins > 90) {
        account.currentStreak = 1;
        account.lastActionAt = now;
      }
    }

    let savedGoal = null;

    if (goal_id) {
      savedGoal = await Goal.findById(goal_id);
      if (!savedGoal) return NextResponse.json({ error: 'Goal not found' }, { status: 404 });

      if (source === 'bank') {
        if (account.main_balance < amount) {
          return NextResponse.json({ error: 'Insufficient main balance' }, { status: 400 });
        }
        account.main_balance -= amount;
      }

      savedGoal.saved_amount = (savedGoal.saved_amount || 0) + amount;
      
      const contribIndex = savedGoal.contributions.findIndex(c => c.user_id.toString() === user_id.toString());
      if (contribIndex >= 0) {
        savedGoal.contributions[contribIndex].amount += amount;
      } else {
        savedGoal.contributions.push({ user_id, amount });
      }

      await savedGoal.save();
    } else {
      if (source === 'bank') {
        if (account.main_balance < amount) {
          return NextResponse.json({ error: 'Insufficient main balance' }, { status: 400 });
        }
        account.main_balance   -= amount;
        account.savings_wallet += amount;
      } else if (source === 'cash') {
        account.cash_savings += amount;
      } else {
        return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
      }
    }

    await account.save();

    await Transaction.create({
      user_id,
      type:   'save',
      amount,
      source: source === 'bank' ? 'wallet' : 'cash',
    });

    if (global.io) {
      const notify = new Set([user_id]);
      if (savedGoal) {
        notify.add(savedGoal.user_id.toString());
        savedGoal.shared_with?.forEach(id => notify.add(id.toString()));
      }
      notify.forEach(uid => global.io.to(`user_${uid}`).emit('data_updated'));
    }

    // First Save Nudge
    const user = await User.findById(user_id);
    if (user && user.hasSaved === false) {
      user.hasSaved = true;
      await user.save();
      
      const emailHtml = `
        <div style="font-family: sans-serif; color: #111;">
          <h2>Good start</h2>
          <p>Hi ${user.name},</p>
          <p>You have taken your first step. Continue saving regularly to reach your goals.</p>
        </div>
      `;
      sendEmail({
        to: user.email,
        subject: "Good start",
        html: emailHtml
      });
    }

    return NextResponse.json({ success: true, message: `Saved ₹${amount}` });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
