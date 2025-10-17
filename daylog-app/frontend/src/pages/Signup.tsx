import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Sparkles } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signUp.email({ email, password, name });

      if (result.error) {
        const errorMessage = result.error.message || 'Failed to create account';
        // Provide more specific error for duplicate email
        if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
          setError('An account with this email already exists');
        } else {
          setError(errorMessage);
        }
        setLoading(false);
      } else {
        // Wait a moment for session to be established, then navigate
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2 gap-2">
            <Heart className="w-10 h-10 text-pink-400 fill-pink-400" />
            <Sparkles className="w-10 h-10 text-purple-400 fill-purple-400" />
          </div>
          <CardTitle className="text-4xl">Join Daylog</CardTitle>
          <CardDescription className="text-base">Start capturing your daily moments</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-pink-500/70">Must be at least 8 characters</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>

            <p className="text-center text-sm text-pink-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-pink-700 hover:text-pink-800 underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
