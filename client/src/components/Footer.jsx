import React from "react";

const team = [
  {
    name: "Muhammad Hossain",
    role: "Software Developer & CEO",
  },
  {
    name: "Mohammed Minul Islam",
    role: "Backend Developer & COO",
  },
  {
    name: "Shahriar Aqib",
    role: "CTO",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-12">
        <div>
          <p className="text-lg font-semibold text-slate-50">SkillBridge</p>
          <p className="mt-2 max-w-xl text-sm text-slate-300">
            Connecting tech talent with meaningful opportunities. Built with care
            by a dedicated leadership and engineering team.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-lg border border-slate-800 bg-slate-950/30 p-4"
            >
              <p className="text-base font-semibold text-slate-50">
                {member.name}
              </p>
              <p className="mt-1 text-sm text-slate-300">{member.role}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-800 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} SkillBridge. All rights reserved.</p>
          <p>Built for ambitious learners and innovators.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

