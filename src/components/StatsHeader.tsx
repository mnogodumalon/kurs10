import { BookOpen, Users, GraduationCap, DoorOpen, CreditCard } from "lucide-react";

interface StatsHeaderProps {
  coursesCount: number;
  participantsCount: number;
  instructorsCount: number;
  roomsCount: number;
  pendingPayments: number;
}

export function StatsHeader({
  coursesCount,
  participantsCount,
  instructorsCount,
  roomsCount,
  pendingPayments,
}: StatsHeaderProps) {
  const stats = [
    { label: "Aktive Kurse", value: coursesCount, icon: BookOpen, accent: false },
    { label: "Teilnehmer", value: participantsCount, icon: Users, accent: false },
    { label: "Dozenten", value: instructorsCount, icon: GraduationCap, accent: false },
    { label: "Raume", value: roomsCount, icon: DoorOpen, accent: false },
    { label: "Offene Zahlungen", value: pendingPayments, icon: CreditCard, accent: true },
  ];

  return (
    <div className="bg-gradient-to-br from-primary to-[hsl(260_70%_50%)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6">
          <h1 className="text-2xl font-800 tracking-tight text-primary-foreground sm:text-3xl">
            KursManager
          </h1>
          <p className="mt-1 text-sm font-300 text-primary-foreground/70">
            Kursverwaltung auf einen Blick
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl px-4 py-3 backdrop-blur-sm transition-all ${
                stat.accent
                  ? "bg-accent/20 border border-accent/30"
                  : "bg-primary-foreground/10 border border-primary-foreground/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <stat.icon className="size-4 text-primary-foreground/70" />
                <span className="text-xs font-500 text-primary-foreground/70 truncate">
                  {stat.label}
                </span>
              </div>
              <p className="mt-1 text-2xl font-700 text-primary-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
