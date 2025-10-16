import { NextResponse} from 'next/server';
import {connectDB} from '@/lib/db';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export async function POST(request: Request, {params}: {params: {token: string}}) {
   
    await connectDB();
    const {token} = params;
    const {password}=await request.json();
    try{

        const user =await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now()},
        })
        if(!user){
            return NextResponse.json({error:"Invalid or expired token"},{status:400});
        }
        const hashedPassword =await bcrypt.hash(password,10);
        user.password=hashedPassword;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpires=undefined;
        await user.save();
        return NextResponse.json({message:"Password has been reset successfully"},{status:200});
    }
    catch(err){
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }

}