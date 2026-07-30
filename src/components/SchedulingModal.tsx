import React, { useState } from 'react';
import { Listing, ScheduledBooking, CategoryType } from '../types';
import { 
  Calendar, 
  Clock, 
  X, 
  CheckCircle2, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Download, 
  Repeat, 
  ChevronRight,
  Gavel,
  Lock,
  CalendarCheck,
  Zap,
  Info
} from 'lucide-react';

interface SchedulingModalProps {
  listings: Listing[];
  initialListing?: Listing | null;
  scheduledBookings: ScheduledBooking[];
  onClose: () => void;
  onConfirmSchedule: (booking: ScheduledBooking) => void;
}

// Generate next 10 dates starting from current date
const generateNext10Days = () => {
  const days = [];
  const baseDate = new Date('2026-07-29');
  for (let i = 0; i < 10; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const displayDay = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    days.push({ dateStr, displayDay, isWeekend: d.getDay() === 0 || d.getDay() === 6 });
  }
  return days;
};

// Available 2-hour UTC Slots
const UTC_TIME_SLOTS = [
  { id: 'slot-1', utcRange: '00:00 - 02:00 UTC', est: '20:00 - 22:00 EST', pst: '17:00 - 19:00 PST', jst: '09:00 - 11:00 JST', status: 'Available' },
  { id: 'slot-2', utcRange: '02:00 - 04:00 UTC', est: '22:00 - 00:00 EST', pst: '19:00 - 21:00 PST', jst: '11:00 - 13:00 JST', status: 'Available' },
  { id: 'slot-3', utcRange: '06:00 - 08:00 UTC', est: '02:00 - 04:00 EST', pst: '23:00 - 01:00 PST', jst: '15:00 - 17:00 JST', status: 'Reserved' },
  { id: 'slot-4', utcRange: '10:00 - 12:00 UTC', est: '06:00 - 08:00 EST', pst: '03:00 - 05:00 PST', jst: '19:00 - 21:00 JST', status: 'Available' },
  { id: 'slot-5', utcRange: '14:00 - 16:00 UTC', est: '10:00 - 12:00 EST', pst: '07:00 - 09:00 PST', jst: '23:00 - 01:00 JST', status: 'Available' },
  { id: 'slot-6', utcRange: '18:00 - 20:00 UTC', est: '14:00 - 16:00 EST', pst: '11:00 - 13:00 PST', jst: '03:00 - 05:00 JST', status: 'Booked' },
  { id: 'slot-7', utcRange: '20:00 - 22:00 UTC', est: '16:00 - 18:00 EST', pst: '13:00 - 15:00 PST', jst: '05:00 - 07:00 JST', status: 'Available' }
];

export const SchedulingModal: React.FC<SchedulingModalProps> = ({
  listings,
  initialListing,
  scheduledBookings,
  onClose,
  onConfirmSchedule
}) => {
  const days = generateNext10Days();
  const [selectedListingId, setSelectedListingId] = useState<string>(
    initialListing?.id || listings[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>(days[0].dateStr);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-5');
  const [hoursToBook, setHoursToBook] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<'schedule' | 'my_calendar'>('schedule');
  const [confirmedBooking, setConfirmedBooking] = useState<ScheduledBooking | null>(null);

  const selectedListing = listings.find(l => l.id === selectedListingId) || listings[0];
  const selectedSlot = UTC_TIME_SLOTS.find(s => s.id === selectedSlotId) || UTC_TIME_SLOTS[0];

  // Calculate UTC credit & USD costs
  const timeCreditsPerHr = selectedListing?.timeCreditsPerHourUTC || 1.0;
  const totalUtcCreditsNeeded = Math.round(timeCreditsPerHr * hoursToBook * 10) / 10;
  const totalUsdEquivalent = Math.round((selectedListing?.pricePerHourUSD || 100) * hoursToBook);

  const handleBookingSubmit = () => {
    if (!selectedListing) return;

    const hash = `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const newBooking: ScheduledBooking = {
      id: `booking-${Date.now()}`,
      listingId: selectedListing.id,
      listingTitle: selectedListing.title,
      category: selectedListing.category,
      dateStr: selectedDate,
      utcTimeSlot: selectedSlot.utcRange,
      hoursBooked: hoursToBook,
      utcCreditsDeducted: totalUtcCreditsNeeded,
      status: 'Confirmed & Locked',
      bookingHash: hash,
      createdAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    onConfirmSchedule(newBooking);
    setConfirmedBooking(newBooking);
  };

  const handleDownloadICS = (booking: ScheduledBooking) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AI Commerce Exchange (ACE)//Global UTC Calendar v2.4//EN',
      'BEGIN:VEVENT',
      `SUMMARY:ACE Escrow Session - ${booking.listingTitle}`,
      `DESCRIPTION:AI Commerce Exchange (ACE) UTC Time Lock Session. Booking Hash: ${booking.bookingHash}`,
      `DTSTART:${booking.dateStr.replace(/-/g, '')}T${booking.utcTimeSlot.substring(0, 2)}0000Z`,
      `DTEND:${booking.dateStr.replace(/-/g, '')}T${booking.utcTimeSlot.substring(8, 10)}0000Z`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ACE_UTC_Booking_${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white border border-sky-200 rounded-2xl max-w-xl w-full p-5 shadow-xl relative flex flex-col max-h-[92vh] overflow-y-auto text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-sky-50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Global Time Calendar &amp; UTC Scheduling</h3>
            <p className="text-xs text-slate-500">Lock escrow time slots in standardized Universal Coordinated Time (UTC)</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-sky-50 p-1 rounded-xl border border-sky-200 text-xs font-semibold mb-4">
          <button
            onClick={() => {
              setActiveTab('schedule');
              setConfirmedBooking(null);
            }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'schedule'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Book UTC Time Slot</span>
          </button>

          <button
            onClick={() => setActiveTab('my_calendar')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'my_calendar'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled Escrow Sessions ({scheduledBookings.length})</span>
          </button>
        </div>

        {activeTab === 'my_calendar' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Active UTC Calendar Slots</span>
              <span className="font-mono text-blue-700 font-bold">{scheduledBookings.length} Bookings</span>
            </div>

            {scheduledBookings.length === 0 ? (
              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-8 text-center space-y-2">
                <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No scheduled UTC escrow bookings yet.</p>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="bg-emerald-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl hover:bg-emerald-700 transition shadow-xs"
                >
                  Schedule Your First Slot
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {scheduledBookings.map((b) => (
                  <div key={b.id} className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {b.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs mt-1">{b.listingTitle}</h4>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-700 bg-white p-2 rounded-lg border border-sky-200">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-sans font-medium">Date &amp; UTC Time Slot</span>
                        <span className="text-blue-700 font-bold">{b.dateStr} • {b.utcTimeSlot}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-sans font-medium">UTC Deducted</span>
                        <span className="text-slate-900 font-bold">{b.utcCreditsDeducted} UTC ({b.hoursBooked} hrs)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                      <span className="truncate max-w-[200px]">Hash: {b.bookingHash}</span>
                      <button
                        onClick={() => handleDownloadICS(b)}
                        className="text-blue-700 hover:text-blue-800 flex items-center gap-1 font-sans font-bold"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export .ICS</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : confirmedBooking ? (
          /* Confirmation Success Card */
          <div className="py-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-lg">UTC Time Slot Locked in Calendar!</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Escrow execution protocol verified for {confirmedBooking.listingTitle}
              </p>
            </div>

            <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 text-left space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-sky-200 pb-2">
                <span className="text-slate-500 font-sans font-medium">Listing Asset:</span>
                <span className="font-bold text-slate-900 truncate max-w-[220px]">{confirmedBooking.listingTitle}</span>
              </div>
              <div className="flex justify-between border-b border-sky-200 pb-2">
                <span className="text-slate-500 font-sans font-medium">Locked UTC Slot:</span>
                <span className="font-bold text-blue-700">{confirmedBooking.dateStr} @ {confirmedBooking.utcTimeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-sky-200 pb-2">
                <span className="text-slate-500 font-sans font-medium">Duration &amp; UTC Credits:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.hoursBooked} Hours ({confirmedBooking.utcCreditsDeducted} UTC)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans font-medium">SHA-256 Audit Token:</span>
                <span className="font-bold text-slate-700 text-[10px]">{confirmedBooking.bookingHash}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleDownloadICS(confirmedBooking)}
                className="py-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 transition border border-sky-300"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download .ICS Invite</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Main Scheduling Form */
          <div className="space-y-4">
            {/* Listing Asset Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Select Asset / Won Auction Listing</span>
                <span className="text-[10px] text-blue-700 font-mono font-bold">
                  Rate: {selectedListing.timeCreditsPerHourUTC} UTC / hr
                </span>
              </label>
              <select
                value={selectedListingId}
                onChange={(e) => setSelectedListingId(e.target.value)}
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              >
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title} ({l.category}) - ${l.pricePerHourUSD}/hr
                  </option>
                ))}
              </select>
            </div>

            {/* Global Date Selector (Next 10 Days) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Global Calendar Date (UTC)</span>
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                {days.map((d) => (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`px-3 py-2 rounded-xl border flex flex-col items-center shrink-0 transition ${
                      selectedDate === d.dateStr
                        ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                        : 'bg-sky-50 border-sky-200 text-slate-700 hover:bg-sky-100'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-mono">{d.displayDay.split(',')[0]}</span>
                    <span className="text-xs font-bold">{d.displayDay.split(',')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UTC Time Slot Grid */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Available UTC Time Slots</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Auto Timezone Converted</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {UTC_TIME_SLOTS.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  const isAvailable = slot.status === 'Available';

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        !isAvailable
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs ring-1 ring-blue-500'
                          : 'bg-sky-50/70 border-sky-200 text-slate-800 hover:bg-sky-100'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-xs font-bold">{slot.utcRange}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-sans font-bold ${
                          !isAvailable
                            ? 'bg-slate-200 text-slate-500'
                            : isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {slot.status}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono pt-1 flex items-center justify-between">
                        <span>EST: {slot.est}</span>
                        <span>PST: {slot.pst}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Booking Duration Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Session Duration</label>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                {[1, 2, 4, 8].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setHoursToBook(hrs)}
                    className={`py-2 rounded-xl border font-bold transition ${
                      hoursToBook === hrs
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-sky-50 border-sky-200 text-slate-700 hover:bg-sky-100'
                    }`}
                  >
                    {hrs} Hr{hrs > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Escrow Ledger & Calculation Box */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                <span className="text-slate-600 flex items-center gap-1 font-medium">
                  <Repeat className="w-3.5 h-3.5 text-blue-600" />
                  <span>UTC Time Credit Cost</span>
                </span>
                <span className="font-mono font-bold text-blue-800 text-sm">
                  {totalUtcCreditsNeeded} UTC
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 text-[11px] font-medium">
                <span>USD Benchmark Value:</span>
                <span className="font-mono text-slate-900 font-bold">${totalUsdEquivalent} USD</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 text-[11px] font-medium">
                <span>Escrow Guarantee Status:</span>
                <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>5.0% Escrow Protected</span>
                </span>
              </div>
            </div>

            {/* Action Submit */}
            <button
              type="button"
              onClick={handleBookingSubmit}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
            >
              <Lock className="w-4 h-4 text-yellow-300" />
              <span>Confirm &amp; Lock {selectedSlot.utcRange} Slot</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
