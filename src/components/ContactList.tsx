import React from 'react';
import { ContactCard } from './ContactCard';
import { VCContact, MediaContact } from '../types';

interface ContactListProps {
  contacts: (VCContact | MediaContact)[];
  type: 'vc' | 'media';
}

export function ContactList({ contacts, type }: ContactListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} type={type} />
      ))}
    </div>
  );
}