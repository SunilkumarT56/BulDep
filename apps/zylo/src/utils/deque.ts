import { createClient } from 'redis';
import { Resend } from 'resend';

const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('ready', () => console.log('Redis Client Ready'));

const resend = new Resend(process.env.RESEND_API_KEY);

const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

const RATE_LIMIT_DELAY = 500;

export const emailSender = async () => {
  await redisClient.connect();

  while (true) {
    try {
      const invite = await redisClient.hGetAll('invite');

      if (!invite.Token || !invite.Email) {
        await sleep(1000);
        continue;
      }

      const { Token, Email, Role } = invite;

      const { error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [Email],
        subject: `Invite email for ${Role}`,
        html: `
          <a href="https://untolerative-len-rumblingly.ngrok-free.dev/user/invites?token=${Token}">
            Click here
          </a>
        `,
      });

      if (error) {
        console.error('Resend error:', error);
        await sleep(2000);
        continue;
      }

      await redisClient.del('invite');

      // 👇 THIS IS THE RATE LIMIT ENFORCER
      await sleep(RATE_LIMIT_DELAY);

    } catch (err) {
      console.error('Worker crashed:', err);
      await sleep(2000);
    }
  }
};
