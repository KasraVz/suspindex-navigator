import { CertificationsTable } from "@/components/certifications/CertificationsTable";

const Certifications = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Certifications</h1>
        <p className="text-muted-foreground">Manage your earned certifications and credentials</p>
      </div>
      <CertificationsTable />
    </div>
  );
};

export default Certifications;