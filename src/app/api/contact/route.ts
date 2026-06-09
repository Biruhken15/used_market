import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import ContactMessage from '@/lib/models/contact-message';
import { handleApiError } from '@/lib/utils/api-error';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Name, email, subject, and message are required.' },
                { status: 400 }
            );
        }

        await dbConnect();

        await ContactMessage.create({
            name: name.trim(),
            email: email.trim(),
            phone: phone?.trim() || '',
            subject: subject.trim(),
            message: message.trim(),
            label: 'New'
        });

        return NextResponse.json({ message: 'Contact message submitted successfully.' }, { status: 201 });
    } catch (error: any) {
        return handleApiError(error);
    }
}
