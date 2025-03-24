import {useContext} from 'react';
import {AuthContext} from '@/context/AuthContext';
import {hasRole} from '@/lib/auth/auth';
import {ROLES, Role} from '@/contstants/roles';

export const useAuth = () => {
    const {user,session} = useContext(AuthContext);
}