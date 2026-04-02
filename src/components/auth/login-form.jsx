import React from 'react';
import { Mail, Lock } from 'lucide-react';
import Button from '../common/button';
import InputField from '../common/input-field';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../schema/auth-schema';

const LoginForm = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onChange'
    });

    const onSubmit = async (data) => {
        try {
            console.log("Login submitted:", data);
            // Simulate API request
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Navigate on success
            // navigate('/dashboard');
        } catch (error) {
            setError("root", { type: "server", message: "Invalid credentials. Please try again." });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full' noValidate>
            <div className='flex flex-col gap-3'>
                {errors.root && (
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl text-sm text-center">
                        {errors.root.message}
                    </div>
                )}
                
                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    icon={Mail}
                    placeholder="Enter Email"
                    autoComplete="email"
                    error={errors.email}
                    {...register("email")}
                />

                <InputField
                    label="Password"
                    id="password"
                    type="password"
                    icon={Lock}
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    error={errors.password}
                    {...register("password")}
                />
            </div>
            
            <div className='flex justify-end my-2'>
                <Link to="/forgot-password"
                    className='text-xs text-end text-primary hover:cursor-pointer hover:text-hover-primary'
                >
                    Forgot password?
                </Link>
            </div>
            
            <Button
                type="submit"
                isLoading={isSubmitting}
                className='px-4 py-3 bg-primary hover:bg-hover-primary text-white text-sm w-full btn-class'
            >
                Login
            </Button>

            <div className='text-xs mt-5 text-center font-semibold flex justify-center items-center gap-1'>
                <span>Don't have an account?</span>
                <Link to="/register" className='text-primary hover:text-hover-primary'>
                    Sign up
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;
