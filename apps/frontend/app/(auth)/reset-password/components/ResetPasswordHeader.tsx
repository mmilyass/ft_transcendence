'use client';

function ResetPasswordHeader() {
  return (
    <>
      <div className="flex flex-col items-center mb-10">
        <h1
          className="font-headline text-2xl font-extrabold tracking-tighter"
          style={{ color: "#191c1e" }}
        >
          Maou<span className="text-blue-500">3</span>idy
        </h1>
      </div>

      <header className="mb-8 text-center">
        <h2
          className="font-headline text-3xl font-bold tracking-tight mb-2"
          style={{ color: "#191c1e" }}
        >
          Reset Password
        </h2>

        <p
          className="text-sm font-medium"
          style={{ color: "#424655" }}
        >
          Enter your new password
        </p>
      </header>
    </>
  );
}

export default ResetPasswordHeader;