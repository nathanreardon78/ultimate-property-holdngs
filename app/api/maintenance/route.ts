import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadFileToS3 } from '@/lib/storage';

export async function POST(request: NextRequest){
  const formData = await request.formData();
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const issueType = String(formData.get('issueType') || '').trim();
  const entryPermission = String(formData.get('entryPermission') || 'yes').trim();
  const description = String(formData.get('description') || '').trim();

  if (!name || !phone || !address || !issueType || !description){
    return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
  }

  let attachmentUrl: string | null = null;
  let attachmentKey: string | null = null;
  const media = formData.get('media');

  if (media instanceof File && media.size > 0){
    try {
      const upload = await uploadFileToS3(media, `maintenance/${Date.now()}`);
      attachmentUrl = upload.url;
      attachmentKey = upload.key;
    } catch (error: any) {
      return NextResponse.json({ message: error.message || 'Unable to upload attachment.' }, { status: 500 });
    }
  }

  const record = await prisma.maintenanceRequest.create({
    data: {
      name,
      phone,
      address,
      issueType,
      entryPermission,
      description,
      attachmentUrl,
      attachmentKey,
    },
  });

  return NextResponse.json({ success: true, ticketId: record.id });
}
