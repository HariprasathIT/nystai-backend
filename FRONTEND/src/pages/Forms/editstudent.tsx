import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import StudentEditForm from "../../components/form/form-elements/editstudentform";

export default function FormeditElements() {
    return (
        <div>
            <PageMeta
                title="Nystai Institute | CCTV & Home Automation Course Training"
                description="Join Nystai Institute to master CCTV installation and home automation systems. Get hands-on training, expert guidance, and industry-ready skills for a successful tech career."
            />

            <PageBreadcrumb pageTitle="Edit Student Form" />
            <div className="space-y-12">
                <StudentEditForm />
            </div>
        </div>
    );
}
