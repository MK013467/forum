import { api } from '@shared/lib/api';
import { useRef, useState } from 'react'

const OTP_LENGTH = 6;

const CheckVerificationCodePage = () => {

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleSubmit = async () => {

        const code = otp.join("");
        const res = await api.post("/auth/verify-code", {code:code});
    }

    function handleChange(value:string , index:number): void {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);


        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        return;
    }

  return (
    <div className='w-2/5 max-w-3xl bg-white border rounded-2xl border sky-400
    text-base p-8 py-12 sm:w-[352]'>
        <div className='text-center'>
            <h1 className='font-bold text-2xl'>Email Verification</h1>
        </div>

            <div className='my-10 flex justify-center gap-4 '>
                {otp.map((digit,index) =>(

                    <input
                    key={index}
                    type='text'
                    value={digit}
                    inputMode='numeric'
                    maxLength={1}
                    ref={(el) => {inputRefs.current[index] = el}}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className='w-16 h-20 border border-gray-200 rounded-2xl text-center text-xl font-bold focus:bg-gray-100'/>
                ))}
            </div>

             <button 
                type="button"
                onClick={handleSubmit}
                className='w-full mt-2 bg-blue-500 rounded-2xl p-4 py-2 text-white text-l font-semibold'
                > 
                Verify Account
            </button>


{/*         
            <button className='bg-white absolute bottom-0 right-0 text-indigo-500'>
                Didn't get verification Code?
            </button> */}
    </div>
  )
}

export default CheckVerificationCodePage