import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, aboutProperty, aboutUnit } = await req.json();
    if(!name || !email || !message) return new Response(JSON.stringify({error:'Missing fields'}), { status: 400 });
    const resend = new Resend(process.env.RESEND_API_KEY);
    const subj: string[] = ['UPH Website Inquiry'];
    if(aboutProperty) subj.push(`Property: ${aboutProperty}`);
    if(aboutUnit) subj.push(`Unit: ${aboutUnit}`);
    const subject = subj.join(' — ') + ` — ${name}`;
    const text = `Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
${aboutProperty ? `Property: ${aboutProperty}
` : ''}${aboutUnit ? `Unit: ${aboutUnit}
` : ''}
Message:
${message}`;
    await resend.emails.send({
      from: 'UPH Website <noreply@yourdomain.com>',
      to: [process.env.CONTACT_TO || 'nathan@membershipauto.com'],
      subject, text,
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
