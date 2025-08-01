
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="Nystai Institute | CCTV & Home Automation Course Training"
        description="Join Nystai Institute to master CCTV installation and home automation systems. Get hands-on training, expert guidance, and industry-ready skills for a successful tech career."
      />
      {/* <PageBreadcrumb pageTitle="Basic Tables" /> */}
      <div className="space-y-6">
        <ComponentCard title="Student Course Details">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}

