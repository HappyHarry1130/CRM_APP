import React from 'react';
import { Mail, Phone, Calendar, Tag, ExternalLink } from 'lucide-react';
import { VCContact, MediaContact } from '../types';
import { MatchScore } from './MatchScore';
import { ContactDetailModal } from './ContactDetailModal';

interface ContactCardProps {
  contact: VCContact | MediaContact;
  type: 'vc' | 'media';
}

export function ContactCard({ contact, type }: ContactCardProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const isVC = type === 'vc';
  const vcContact = contact as VCContact;
  const mediaContact = contact as MediaContact;

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{contact.name}</h3>
              <p className="text-gray-600">
                {isVC ? vcContact.firm : mediaContact.outlet}
              </p>
            </div>
            <div className="flex gap-2">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Match Score</p>
            <MatchScore score={contact.matchScore} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <a 
                href={`mailto:${contact.email}`} 
                className="hover:text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                {contact.email}
              </a>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{contact.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Last Contact: {contact.lastContact}</span>
            </div>
          </div>

          {isVC ? (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Investment Focus:</span>{' '}
                {vcContact.investmentFocus.join(', ')}
              </p>
              <p className="text-sm">
                <span className="font-medium">Check Size:</span> {vcContact.checkSize}
              </p>
              <p className="text-sm">
                <span className="font-medium">Stage:</span>{' '}
                {vcContact.stage.join(', ')}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Beats:</span>{' '}
                {mediaContact.beats.join(', ')}
              </p>
              <p className="text-sm">
                <span className="font-medium">Timezone:</span>{' '}
                {mediaContact.timezone}
              </p>
              <p className="text-sm">
                <span className="font-medium">Preferred Contact:</span>{' '}
                {mediaContact.preferredContactMethod}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">{contact.notes}</p>
          </div>
        </div>
      </div>

      <ContactDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={contact}
        type={type}
      />
    </>
  );
}