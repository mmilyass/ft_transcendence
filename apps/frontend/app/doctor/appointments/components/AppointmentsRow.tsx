import { Appointment, STATUS_COLORS } from "../page";
type AppointmentsRowProps = {
  appointment: Appointment;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  actionId: string | null;
};

export default function AppointmentsRow({
  appointment,
  onComplete,
  onCancel,
  actionId,
}: AppointmentsRowProps) {
  return (
    <div
      key={appointment.id}
      className="grid grid-cols-12 items-center bg-surface-container-lowest p-5 rounded-2xl transition-all hover:bg-surface-bright group"
    >
      <div className="col-span-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">person</span>
        </div>
        <div>
          <h4 className="font-bold text-on-surface">
            {appointment.patientName}
          </h4>
          <p className="text-xs text-on-surface-variant">
            ID: #{appointment.id}
          </p>
        </div>
      </div>
      <div className="col-span-2">
        <span className="text-sm font-medium text-on-surface">
          {appointment.service}
        </span>
      </div>
      <div className="col-span-3">
        <div className="flex items-center gap-2 text-on-surface text-sm">
          <span className="material-symbols-outlined text-primary text-lg">
            calendar_today
          </span>
          <span className="font-semibold">{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant text-xs mt-1">
          <span className="material-symbols-outlined text-lg">schedule</span>
          <span>{appointment.time}</span>
        </div>
      </div>
      <div className="col-span-1 flex justify-center">
        <span
          className={`px-3 py-1 text-[10px] font-black uppercase rounded-full tracking-wide ${
            STATUS_COLORS[appointment.status].bg
          } ${STATUS_COLORS[appointment.status].text}`}
        >
          {appointment.status}
        </span>
      </div>
      <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {appointment.status === "BOOKED" ? (
          <>
            <button
              onClick={() => onComplete(appointment.id)}
              disabled={actionId === appointment.id}
              className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
              title="Mark completed"
            >
              <span className="material-symbols-outlined">task_alt</span>
            </button>
            <button
              onClick={() => onCancel(appointment.id)}
              disabled={actionId === appointment.id}
              className="p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors"
              title="Cancel appointment"
            >
              <span className="material-symbols-outlined">cancel</span>
            </button>
          </>
        ) : (
          <button className="px-4 py-2 rounded-xl bg-surface-container text-on-surface-variant text-xs font-bold">
            {appointment.status === "COMPLETED" ? "Completed" : "Cancelled"}
          </button>
        )}
      </div>
    </div>
  );
}
