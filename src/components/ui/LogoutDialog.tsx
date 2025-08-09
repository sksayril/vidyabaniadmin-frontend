import React from 'react';
import { LogOut, AlertTriangle, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './dialog';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-red-100 rounded-lg">
              <LogOut className="text-red-600" size={20} />
            </div>
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-gray-600 leading-relaxed">
            Are you sure you want to logout? You will need to sign in again to access the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-600 mt-0.5" size={16} />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Security Notice:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your session will be completely terminated</li>
                  <li>• All authentication tokens will be cleared</li>
                  <li>• You'll be redirected to the login page</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all font-medium flex items-center gap-2"
          >
            <Shield size={16} />
            Logout
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
