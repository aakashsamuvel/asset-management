import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";
import { useAuth } from '../auth/useAuth';

interface User {
    id: number;
    fullName: string;
    email: string;
}

interface TransferAssetProps {
    assetId: number;
    isOpen: boolean;
    onClose: () => void;
    onTransfer: () => void;
}

const TransferAsset: React.FC<TransferAssetProps> = ({ assetId, isOpen, onClose, onTransfer }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        if (isOpen) {
            fetch('http://localhost:5018/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => setUsers(data));
        }
    }, [isOpen, token]);

    const handleTransfer = async () => {
        if (!selectedUserId) return;

        try {
            const response = await fetch(`http://localhost:5018/api/assets/${assetId}/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newAssigneeId: parseInt(selectedUserId, 10) })
            });

            if (response.ok) {
                onTransfer();
                onClose();
            } else {
                console.error('Failed to transfer asset');
            }
        } catch (error) {
            console.error('Error transferring asset:', error);
        }
    };

    const userOptions = users.map(user => ({
        value: user.id.toString(),
        label: `${user.fullName} (${user.email})`
    }));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer Asset</DialogTitle>
                    <DialogDescription>
                        Select a new user to transfer the asset to.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Combobox
                        options={userOptions}
                        value={selectedUserId || ""}
                        onChange={(value) => setSelectedUserId(value)}
                        placeholder="Select a user to transfer to"
                    />
                </div>
                <DialogFooter>
                    <Button onClick={onClose} variant="outline">Cancel</Button>
                    <Button onClick={handleTransfer} disabled={!selectedUserId}>Transfer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TransferAsset;