import { User } from '@/app/layout';

export interface LoginFormProps {
	setUser: (user: User | null) => void;
}