import { NextResponse } from 'next/server';

export class ApiError extends Error {
    constructor(public message: string, public status: number = 400) {
        super(message);
        this.name = 'ApiError';
    }
}

export function handleApiError(error: any) {
    console.error('[API ERROR]:', error);

    if (error instanceof ApiError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status }
        );
    }

    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        return NextResponse.json(
            { error: messages.join(', ') },
            { status: 400 }
        );
    }

    // Duplicate Key Error (MongoDB)
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return NextResponse.json(
            { error: `This ${field} is already in use. Please use another.` },
            { status: 400 }
        );
    }

    // Default Error
    return NextResponse.json(
        { error: 'An internal server error occurred. Please try again later.' },
        { status: 500 }
    );
}
