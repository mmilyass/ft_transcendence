'use client';
import Img from 'next/image';
import { Application } from '../page';
import { activateDoctor, approveDoctor, rejectDoctor, suspendDoctor } from '../action';
import { useRouter } from 'next/dist/client/components/navigation';
import { DoctorApplication } from '../page';
import { toast } from 'react-toastify';
export default function ApplicationRow({
  id,
  name,
  email,
  doctor: { speciality, createdAt: date } = {} as DoctorApplication,
  image,
  role,
}: Application) {
  const imageUrl = image || 'https:////lh3.googleusercontent.com/aida-public/AB6AXuCBjDWk6NjxRZQjErGRFTKvSiKzuD4XKP31oD0QgnHFCPBxoEc3oN-Y7Iuo04ebt4OVipN5BD1MBFuqGanpv7ITYMNdmUgF5rtR101vbNfQqdYCXv7ESXrMFQQC77I0SMI62gZcl4tZPbIeXrxHNudVnxZ39qEz_EZ_wJrwkK5QXI8UnGHsRLi-Ep_ibUNy_iZKGGWxDtBCXcxo0UWem8EOpm6MnhE_7tIqEQmY7bHF-dao-ynWD8r_86ACUKqyILh_wyv2XCmcC_g';
  const router = useRouter();
  return (
    <tr className="bg-surface-container-lowest hover:bg-surface-bright transition-colors group">
      <td className="px-6 py-5 rounded-l-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden">
            <Img
              src={imageUrl}
              alt={name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="font-bold text-base">{name}</div>
            <div className="text-xs text-on-surface-variant">
              {email}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="inline-flex items-center px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-xs font-bold">
          {speciality}
        </div>
      </td>

      <td className="px-6 py-5 text-sm">
        {date}
      </td>

      <td className="px-6 py-5">
        <span
          className={`px-3 py-1.5 font-bold text-xs rounded-lg flex items-center gap-2 w-fit ${
            role === "PENDING_DOCTOR"
              ? "bg-tertiary-container/10 text-tertiary"
              : role === "REJECTED"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              role === "PENDING_DOCTOR"
                ? "bg-tertiary"
                : role === "REJECTED"
                ? "bg-red-600"
                : "bg-green-600"
            }`}
          />

          {role === "PENDING_DOCTOR"
            ? "Pending"
            : role === "REJECTED"
            ? "Rejected"
            : "Approved"}
        </span>
      </td>

      <td className="px-6 py-5 rounded-r-2xl text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

          {role === "PENDING_DOCTOR" && (
          <button onClick={async () => {
            try {
              await approveDoctor(id);
              router.refresh();
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Failed to approve doctor");
            }
          }} className="p-2 hover:text-green-600">
            <span className="material-symbols-outlined">
              check_circle
            </span>
          </button>)}
          { role === "PENDING_DOCTOR" && (
            <button onClick={async () => {
              try {
                await rejectDoctor(id);
                router.refresh();
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to reject doctor");
              }
            }} className="p-2 hover:text-error">
              <span className="material-symbols-outlined">
                cancel
              </span>
            </button>
          )}
          {role === "DOCTOR" && (
            <>
            <button onClick={async () => {
              try {
                await rejectDoctor(id);
                router.refresh();
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to reject doctor");
              }
            }} className="p-2 hover:text-error">
              <span className="material-symbols-outlined">
                cancel
              </span>
            </button>
            <button onClick={async () => {
              try {
                await suspendDoctor(id);
                router.refresh();
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to suspend doctor");
              }
            }} className="p-2 hover:text-error">
              <span className="material-symbols-outlined">
                block
              </span>
            </button>
              </>
          )}
          {role === "REJECTED" && (
            <button onClick={async () => {
              try {
                await activateDoctor(id);
                router.refresh();
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to activate doctor");
              }
            }} className="p-2 hover:text-success">
              <span className="material-symbols-outlined">
                check_circle
              </span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}