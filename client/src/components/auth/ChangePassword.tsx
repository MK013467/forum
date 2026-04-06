import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { toast } from 'react-toastify';
import { api } from '../../api';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Must be at least 8 characters')
      .max(20, 'Must not exceed 20 characters')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

const ChangePasswordPage = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit: SubmitHandler<ChangePasswordForm> = async (data) => {
    try {
      await api.patch('/user/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success('Password changed successfully!', {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
      });

      reset();
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to change password';

      setError('root', {
        type: 'server',
        message,
      });

      toast.error(message, {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="w-full flex justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <div className="relative">
              <input
                {...register('currentPassword')}
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Current password"
                className="w-full border rounded-2xl border-gray-300 px-4 py-3 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showCurrentPassword ? <GoEyeClosed /> : <GoEye />}
              </button>
            </div>
            <p className="min-h-[20px] mt-1 text-sm text-red-500">
              {errors.currentPassword?.message ?? ''}
            </p>
          </div>

          <div>
            <div className="relative">
              <input
                {...register('newPassword')}
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New password"
                className="w-full border rounded-2xl border-gray-300 px-4 py-3 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showNewPassword ? <GoEyeClosed /> : <GoEye />}
              </button>
            </div>
            <p className="min-h-[20px] mt-1 text-sm text-red-500">
              {errors.newPassword?.message ?? ''}
            </p>
          </div>

          <div>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="w-full border rounded-2xl border-gray-300 px-4 py-3 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <GoEyeClosed /> : <GoEye />}
              </button>
            </div>
            <p className="min-h-[20px] mt-1 text-sm text-red-500">
              {errors.confirmPassword?.message ?? ''}
            </p>
          </div>

          <p className="min-h-[20px] text-sm text-red-500">
            {errors.root?.message ?? ''}
          </p>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full rounded-2xl py-3 font-semibold text-white ${
              isValid && !isSubmitting
                ? 'bg-indigo-500 hover:bg-indigo-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;