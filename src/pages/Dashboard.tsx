import { useState, useEffect, useCallback } from "react";
import { BookOpen, GraduationCap, Users, DoorOpen, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from "sonner";
import { StatsHeader } from "@/components/StatsHeader";
import { CoursesTab } from "@/components/CoursesTab";
import { InstructorsTab } from "@/components/InstructorsTab";
import { ParticipantsTab } from "@/components/ParticipantsTab";
import { RoomsTab } from "@/components/RoomsTab";
import { EnrollmentsTab } from "@/components/EnrollmentsTab";
import { LivingAppsService } from "@/services/livingAppsService";
import type { Courses, Instructors, Participants, Rooms, Enrollments } from "@/types/app";

export default function Dashboard() {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [instructors, setInstructors] = useState<Instructors[]>([]);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollments[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, i, p, r, e] = await Promise.all([
        LivingAppsService.getCourses(),
        LivingAppsService.getInstructors(),
        LivingAppsService.getParticipants(),
        LivingAppsService.getRooms(),
        LivingAppsService.getEnrollments(),
      ]);
      setCourses(c);
      setInstructors(i);
      setParticipants(p);
      setRooms(r);
      setEnrollments(e);
    } catch (err) {
      console.error("Failed to load data:", err);
      toast.error("Daten konnten nicht geladen werden");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const pendingPayments = enrollments.filter((e) => !e.fields.paid).length;

  // Course CRUD
  const handleAddCourse = async (fields: Courses["fields"]) => {
    try {
      await LivingAppsService.createCourse(fields);
      setCourses(await LivingAppsService.getCourses());
      toast.success("Kurs erstellt");
    } catch { toast.error("Fehler beim Erstellen"); }
  };
  const handleUpdateCourse = async (id: string, fields: Partial<Courses["fields"]>) => {
    try {
      await LivingAppsService.updateCourse(id, fields);
      setCourses(await LivingAppsService.getCourses());
      toast.success("Kurs aktualisiert");
    } catch { toast.error("Fehler beim Aktualisieren"); }
  };
  const handleDeleteCourse = async (id: string) => {
    try {
      await LivingAppsService.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.record_id !== id));
      toast.success("Kurs geloscht");
    } catch { toast.error("Fehler beim Loschen"); }
  };

  // Instructor CRUD
  const handleAddInstructor = async (fields: Instructors["fields"]) => {
    try {
      await LivingAppsService.createInstructor(fields);
      setInstructors(await LivingAppsService.getInstructors());
      toast.success("Dozent erstellt");
    } catch { toast.error("Fehler beim Erstellen"); }
  };
  const handleUpdateInstructor = async (id: string, fields: Partial<Instructors["fields"]>) => {
    try {
      await LivingAppsService.updateInstructor(id, fields);
      setInstructors(await LivingAppsService.getInstructors());
      toast.success("Dozent aktualisiert");
    } catch { toast.error("Fehler beim Aktualisieren"); }
  };
  const handleDeleteInstructor = async (id: string) => {
    try {
      await LivingAppsService.deleteInstructor(id);
      setInstructors((prev) => prev.filter((i) => i.record_id !== id));
      toast.success("Dozent geloscht");
    } catch { toast.error("Fehler beim Loschen"); }
  };

  // Participant CRUD
  const handleAddParticipant = async (fields: Participants["fields"]) => {
    try {
      await LivingAppsService.createParticipant(fields);
      setParticipants(await LivingAppsService.getParticipants());
      toast.success("Teilnehmer erstellt");
    } catch { toast.error("Fehler beim Erstellen"); }
  };
  const handleUpdateParticipant = async (id: string, fields: Partial<Participants["fields"]>) => {
    try {
      await LivingAppsService.updateParticipant(id, fields);
      setParticipants(await LivingAppsService.getParticipants());
      toast.success("Teilnehmer aktualisiert");
    } catch { toast.error("Fehler beim Aktualisieren"); }
  };
  const handleDeleteParticipant = async (id: string) => {
    try {
      await LivingAppsService.deleteParticipant(id);
      setParticipants((prev) => prev.filter((p) => p.record_id !== id));
      toast.success("Teilnehmer geloscht");
    } catch { toast.error("Fehler beim Loschen"); }
  };

  // Room CRUD
  const handleAddRoom = async (fields: Rooms["fields"]) => {
    try {
      await LivingAppsService.createRoom(fields);
      setRooms(await LivingAppsService.getRooms());
      toast.success("Raum erstellt");
    } catch { toast.error("Fehler beim Erstellen"); }
  };
  const handleUpdateRoom = async (id: string, fields: Partial<Rooms["fields"]>) => {
    try {
      await LivingAppsService.updateRoom(id, fields);
      setRooms(await LivingAppsService.getRooms());
      toast.success("Raum aktualisiert");
    } catch { toast.error("Fehler beim Aktualisieren"); }
  };
  const handleDeleteRoom = async (id: string) => {
    try {
      await LivingAppsService.deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.record_id !== id));
      toast.success("Raum geloscht");
    } catch { toast.error("Fehler beim Loschen"); }
  };

  // Enrollment CRUD
  const handleAddEnrollment = async (fields: Enrollments["fields"]) => {
    try {
      await LivingAppsService.createEnrollment(fields);
      setEnrollments(await LivingAppsService.getEnrollments());
      toast.success("Anmeldung erstellt");
    } catch { toast.error("Fehler beim Erstellen"); }
  };
  const handleUpdateEnrollment = async (id: string, fields: Partial<Enrollments["fields"]>) => {
    try {
      await LivingAppsService.updateEnrollment(id, fields);
      setEnrollments(await LivingAppsService.getEnrollments());
      toast.success("Anmeldung aktualisiert");
    } catch { toast.error("Fehler beim Aktualisieren"); }
  };
  const handleDeleteEnrollment = async (id: string) => {
    try {
      await LivingAppsService.deleteEnrollment(id);
      setEnrollments((prev) => prev.filter((e) => e.record_id !== id));
      toast.success("Anmeldung geloscht");
    } catch { toast.error("Fehler beim Loschen"); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />

      <StatsHeader
        coursesCount={courses.length}
        participantsCount={participants.length}
        instructorsCount={instructors.length}
        roomsCount={rooms.length}
        pendingPayments={pendingPayments}
      />

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="courses" className="gap-1.5">
              <BookOpen className="size-4" />
              <span className="hidden sm:inline">Kurse</span>
            </TabsTrigger>
            <TabsTrigger value="instructors" className="gap-1.5">
              <GraduationCap className="size-4" />
              <span className="hidden sm:inline">Dozenten</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="gap-1.5">
              <Users className="size-4" />
              <span className="hidden sm:inline">Teilnehmer</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="gap-1.5">
              <DoorOpen className="size-4" />
              <span className="hidden sm:inline">Raume</span>
            </TabsTrigger>
            <TabsTrigger value="enrollments" className="gap-1.5">
              <ClipboardList className="size-4" />
              <span className="hidden sm:inline">Anmeldungen</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <CoursesTab
              courses={courses}
              instructors={instructors}
              rooms={rooms}
              loading={loading}
              onAdd={handleAddCourse}
              onUpdate={handleUpdateCourse}
              onDelete={handleDeleteCourse}
            />
          </TabsContent>

          <TabsContent value="instructors">
            <InstructorsTab
              instructors={instructors}
              loading={loading}
              onAdd={handleAddInstructor}
              onUpdate={handleUpdateInstructor}
              onDelete={handleDeleteInstructor}
            />
          </TabsContent>

          <TabsContent value="participants">
            <ParticipantsTab
              participants={participants}
              loading={loading}
              onAdd={handleAddParticipant}
              onUpdate={handleUpdateParticipant}
              onDelete={handleDeleteParticipant}
            />
          </TabsContent>

          <TabsContent value="rooms">
            <RoomsTab
              rooms={rooms}
              loading={loading}
              onAdd={handleAddRoom}
              onUpdate={handleUpdateRoom}
              onDelete={handleDeleteRoom}
            />
          </TabsContent>

          <TabsContent value="enrollments">
            <EnrollmentsTab
              enrollments={enrollments}
              courses={courses}
              participants={participants}
              loading={loading}
              onAdd={handleAddEnrollment}
              onUpdate={handleUpdateEnrollment}
              onDelete={handleDeleteEnrollment}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
