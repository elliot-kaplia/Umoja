"use client";

import { useState } from "react";
import { Checkbox, Button, Alert } from "flowbite-react";

export default function ConsentementNotifications() {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isChecked) {
      setIsSubmitted(true);
    } else {
      alert("Vous devez accepter pour continuer.");
    }
  };

  return (
    <div className="mt-10 mb-10 flex items-center justify-center px-4 py-8">
      <div className="p-6 rounded-lg shadow-md max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-4">
          Consentement aux Notifications
        </h1>
        <p className="text-sm mb-2">
          En acceptant, vous autorisez <strong>Umoja</strong> à vous envoyer des emails pour :
        </p>
        <ul className="list-disc pl-6 mb-6 text-sm">
          <li>Des mises à jour sur vos projets</li>
          <li>Des invitations à participer à des offres</li>
          <li>Des actualités et événements musicaux exclusifs</li>
        </ul>
        {isSubmitted ? (
          <Alert color="success">
            Merci pour votre consentement ! Vous recevrez désormais des notifications par email.
          </Alert>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div className="flex items-start mb-4">
              <Checkbox
                id="consentement"
                name="consentement"
                value="accepted"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="consentement" className="text-sm">
                J&apos;accepte de recevoir des notifications et emails de la part de Umoja.
              </label>
            </div>
            <Button type="submit" className="w-full mt-4" disabled={!isChecked}>
              Valider mon consentement
            </Button>
          </form>
        )}
        <p className="text-xs mt-4 text-center">
          Vous pouvez révoquer votre consentement à tout moment depuis vos <a href="/preferences-notifications" className="text-blue-600 underline">préférences</a>.
        </p>
      </div>
    </div>
  );
}
