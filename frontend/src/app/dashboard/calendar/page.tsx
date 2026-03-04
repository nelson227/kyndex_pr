'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserStorage, setUserStorage } from '@/lib/user-storage';

interface Note {
  id: string;
  dateKey: string;
  title: string;
  description: string;
  time?: string;
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteTime, setNoteTime] = useState('');

  // Charger les notes depuis localStorage (isolées par utilisateur)
  useEffect(() => {
    if (!user?.id) {
      console.log('⏳ Waiting for user to be loaded...');
      return;
    }

    const savedNotes = getUserStorage<Note[]>('calendar_notes', user.id);
    if (savedNotes && Array.isArray(savedNotes)) {
      setNotes(savedNotes);
      console.log(`✓ Loaded ${savedNotes.length} notes for user ${user.id}`);
    } else {
      setNotes([]);
      console.log(`✓ No notes found for user ${user.id} (first time or fresh start)`);
    }
  }, [user?.id]);

  // Sauvegarder les notes dans localStorage (isolées par utilisateur)
  const saveNotes = (updatedNotes: Note[]) => {
    if (!user?.id) {
      console.error('❌ Cannot save notes: user not authenticated');
      return;
    }

    setNotes(updatedNotes);
    const success = setUserStorage('calendar_notes', updatedNotes, user.id);
    
    if (success) {
      console.log(`✓ Saved ${updatedNotes.length} notes for user ${user.id}`);
    } else {
      console.error(`❌ Failed to save notes for user ${user.id}`);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getNotesForDate = (dateKey: string) => {
    return notes.filter((note) => note.dateKey === dateKey);
  };

  const handleAddNote = () => {
    if (!selectedDate || !noteTitle.trim()) {
      alert('Veuillez entrer un titre pour la note');
      return;
    }

    const newNote: Note = {
      id: `${Date.now()}`,
      dateKey: selectedDate,
      title: noteTitle,
      description: noteDescription,
      time: noteTime || undefined,
    };

    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);

    // Réinitialiser le formulaire
    setNoteTitle('');
    setNoteDescription('');
    setNoteTime('');
    setShowNoteForm(false);
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    saveNotes(updatedNotes);
  };

  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const handleDateClick = (month: number, day: number) => {
    const dateKey = formatDateKey(currentYear, month, day);
    setSelectedDate(dateKey);
    setShowNoteForm(true);
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const selectedDateNotes = selectedDate ? getNotesForDate(selectedDate) : [];
  const todayKey = formatDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  // Fonction pour rendre un mois
  const renderMonth = (month: number) => {
    const date = new Date(currentYear, month, 1);
    const daysInCurrentMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const calendarDays = [];

    // Ajouter les espaces vides
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }

    // Ajouter les jours du mois
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      calendarDays.push(day);
    }

    return (
      <div key={month} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
        <h3 className="text-center text-sm font-bold text-white mb-2">{monthNames[month]}</h3>
        
        {/* Mini en-têtes des jours (même ligne) */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-gray-500 text-xs py-1">
              {day.substring(0, 1)}
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const dateKey = day ? formatDateKey(currentYear, month, day) : null;
            const dayNotes = dateKey ? getNotesForDate(dateKey) : [];
            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedDate;

            return (
              <div
                key={idx}
                onClick={() => day && handleDateClick(month, day)}
                className={`aspect-square rounded text-xs font-semibold transition cursor-pointer flex items-center justify-center relative group ${
                  !day
                    ? 'bg-gray-950 border border-gray-900'
                    : isSelected
                    ? 'bg-cyan-500/30 border border-cyan-500 text-cyan-300'
                    : isToday
                    ? 'bg-purple-500/30 border border-purple-500 text-purple-300'
                    : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-cyan-500/50 hover:bg-gray-800'
                }`}
              >
                {day && (
                  <>
                    <span>{day}</span>
                    {dayNotes.length > 0 && (
                      <div className="absolute bottom-0.5 w-1 h-1 bg-cyan-400 rounded-full"></div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-gray-400 text-sm mb-1">Calendrier</p>
        <h1 className="text-4xl font-bold text-white">Planification</h1>
        <p className="text-gray-400 mt-2">Organisez vos événements et prenez des notes facilement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier principal - Vue annuelle */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation et titre de l'année */}
          <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-6">
            <button
              onClick={handlePrevYear}
              className="text-gray-400 hover:text-cyan-400 transition text-2xl"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold text-white">
              Année {currentYear}
            </h2>
            <button
              onClick={handleNextYear}
              className="text-gray-400 hover:text-cyan-400 transition text-2xl"
            >
              →
            </button>
          </div>

          {/* Grille 3x4 des 12 mois */}
          <div className="grid grid-cols-3 gap-4 bg-gray-900/50 rounded-xl p-6">
            {Array.from({ length: 12 }).map((_, month) => renderMonth(month))}
          </div>
        </div>

        {/* Panneau des notes (droite) */}
        <div className="lg:col-span-1">
          {/* Affichage des notes du jour sélectionné */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-20">
            <h3 className="text-lg font-bold text-white mb-4">
              {selectedDate
                ? `Notes du ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}`
                : 'Sélectionnez une date'}
            </h3>

            {/* Liste des notes */}
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {selectedDateNotes.length > 0 ? (
                selectedDateNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{note.title}</h4>
                        {note.time && (
                          <p className="text-xs text-cyan-400 mt-1">🕐 {note.time}</p>
                        )}
                        {note.description && (
                          <p className="text-xs text-gray-400 mt-2 line-clamp-3">{note.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="ml-2 text-gray-500 hover:text-red-400 transition text-lg opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">
                  {selectedDate ? 'Aucune note pour ce jour' : ''}
                </p>
              )}
            </div>

            {/* Bouton pour ajouter une note */}
            {selectedDate && !showNoteForm && (
              <button
                onClick={() => setShowNoteForm(true)}
                className="w-full py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/30 rounded-lg font-semibold transition text-sm"
              >
                + Ajouter une note
              </button>
            )}

            {/* Formulaire pour ajouter une note */}
            {showNoteForm && selectedDate && (
              <div className="space-y-3 border-t border-gray-700 pt-4 mt-4">
                <input
                  type="text"
                  placeholder="Titre de la note"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 transition"
                />
                <input
                  type="time"
                  value={noteTime}
                  onChange={(e) => setNoteTime(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 transition"
                />
                <textarea
                  placeholder="Description (optionnel)"
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 transition resize-none h-20"
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleAddNote}
                    className="flex-1 py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition text-sm"
                  >
                    Ajouter
                  </button>
                  <button
                    onClick={() => {
                      setShowNoteForm(false);
                      setNoteTitle('');
                      setNoteDescription('');
                      setNoteTime('');
                    }}
                    className="flex-1 py-2 bg-gray-800 text-gray-300 font-semibold rounded-lg hover:bg-gray-700 transition text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
