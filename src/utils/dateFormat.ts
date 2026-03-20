import dayjs from 'dayjs';
import 'dayjs/locale/fr';

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";

  const date = dayjs(dateString);
  if (!date.isValid()) {
    console.error("Date invalide :", dateString);
    return "Date invalide";
  }

  return date.locale('fr').format('DD/MM/YYYY à HH:mm');
};

// Fonction pour formater la date et l'heure selon les besoins
export const formatEventDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Formatage de la date (ex: "lundi 14 février 2026")
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formattedStartDate = start.toLocaleDateString('fr-FR', dateOptions);

  // Formatage de l'heure (ex: "14h30")
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  const formattedStartTime = start.toLocaleTimeString('fr-FR', timeOptions);
  const formattedEndTime = end.toLocaleTimeString('fr-FR', timeOptions);

  // Si la date de début et de fin sont identiques
  if (start.toDateString() === end.toDateString()) {
    return {
      date: formattedStartDate,
      time: `${formattedStartTime} - ${formattedEndTime}`,
    };
  }
  // Si les dates sont différentes
  else {
    const formattedEndDate = end.toLocaleDateString('fr-FR', dateOptions);
    return {
      date: `${formattedStartDate} au ${formattedEndDate}`,
      time: `${formattedStartTime} - ${formattedEndTime}`,
    };
  }
};
