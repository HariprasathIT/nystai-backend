import { Link } from "react-router";
import PageBreadcrumb from "../common/PageBreadCrumb";
import PageMeta from "../common/PageMeta";
import { Pencil, Trash2, X } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { ArrowLeft } from "lucide-react";
import detailsbanner from "../../../public/images/AllCourse/coursedetailsbanner.jpg";

const Courses1 = () => {
    const {
        isOpen: isEditOpen,
        openModal: openEditModal,
        closeModal: closeEditModal
    } = useModal();

    const {
        isOpen: isDeleteOpen,
        openModal: openDeleteModal,
        closeModal: closeDeleteModal
    } = useModal();

    const handleSave = () => {
        console.log("Saving changes...");
        closeEditModal();
    };

    const handleDelete = () => {
        console.log("Course deleted.");
        closeDeleteModal();
    };

    return (
        <>
            <PageMeta
                title="Nystai Institute | CCTV & Home Automation Course Training"
                description="Join Nystai Institute to master CCTV installation and home automation systems. Get hands-on training, expert guidance, and industry-ready skills for a successful tech career."
            />
            <PageBreadcrumb
                pageTitle="Courses"
                pageTitleLink="/Courses"
                pageTitle1="System Integration Program"
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="mb-5 flex items-center justify-between lg:mb-7">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        System Integration Program
                    </h3>
                    <div className="flex flex-row gap-6">
                        <button
                            onClick={openDeleteModal}
                            className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>

                        <button
                            onClick={openEditModal}
                            className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit Course
                        </button>
                    </div>

                        <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} className="max-w-md m-4">
                            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 ">
                                <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-8">
                                Confirm Course Deletion
                                </h4>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={closeDeleteModal}
                                    className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                    >
                                    Yes, Delete Course
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                    className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800 dark:text-white/90"
                                    >
                                    <X size={18} className="text-[#F8C723]" />
                                    </button>
                                </div>
                            </div>
                        </Modal>

                        <Modal isOpen={isEditOpen} onClose={closeEditModal} className="max-w-[700px] m-4">
                            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                    Edit Course Form
                                </h4>
                                <form className="flex flex-col mt-5">
                                    <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                            <div>
                                                <Label className="mb-3">Course Name</Label>
                                                <Input type="text" placeholder="System Integration Program" />
                                            </div>
                                            <div>
                                                <Label className="mb-3">Course Duration</Label>
                                                <Input type="text" placeholder="7 Days" />
                                            </div>
                                            <div>
                                                <Label className="mb-3">Course Overview</Label>
                                                <textarea
                                                    placeholder="Overview here"
                                                    className="w-full border rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-theme-xs px-3 py-2 h-[200px] resize-none text-sm text-gray-700 placeholder:text-gray-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="mb-3">Upload Images</Label>
                                                <FileUploadBox />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
                                        <button onClick={closeEditModal} className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800 dark:text-white/90">
                                            <ArrowLeft className="size-5 text-[#F8C723]" />
                                        </button>
                                        <button
                                            type="button"
                                        className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-20 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                            onClick={handleSave}
                                        >
                                            Edit Course
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Modal>

                </div>

                <div className="space-y-6">
                    <div className="grid lg:grid-cols-1 gap-12 ">
                        <div className="rounded-2xl overflow-hidden ">
                            {/* Image - full height and aspect ratio maintained */}
                            <img
                                src={detailsbanner}
                                alt="Card image"
                                className="w-full h-[350px] object-cover object-center"
                            />
                            {/* Content */}
                            <div className="p-5 flex flex-col justify-between">
                                {/* Key:Value Title */}
                                <div className="mb-5">
                                    <span className="text-xl font-semibold text-gray-700 dark:text-white/90">Duration&nbsp;&nbsp;&nbsp;:</span>{' '}
                                    <span className="text-base text-lg text-gray-800 dark:text-gray-300">7 Days</span>
                                </div>

                                {/* Key:Value Description */}
                                <div className="mb-5">
                                    <span className="text-xl font-semibold text-gray-700 dark:text-white/90">Overview&nbsp;:</span>{' '}
                                    <span className="text-base text-lg text-gray-600 dark:text-gray-400">
                                        The System Integration Program offered by NYST.ai is a 7-day beginner-friendly course designed to introduce students to the fundamentals of IoT and device communication. The program focuses on building foundational skills in sensor integration, hardware communication, and real-time data processing. Students will gain a practical understanding of how different components of an IoT system such as sensors, actuators, microcontrollers, and dashboards work together to create intelligent hardware systems.
                                    </span>
                                </div>
                                {/* Key:Value Description */}
                                <div className="mb-5">
                                    <span className="text-base text-lg text-gray-600 dark:text-gray-400">
                                        Throughout the course, participants will explore the architecture of IoT systems, learn how to interface popular development boards like Arduino and Raspberry Pi, and experiment with a variety of sensors such as DHT11, IR, and Ultrasonic. The program covers key data communication protocols including UART, I2C, SPI, and MQTT, and introduces students to basic dashboard integration and system testing techniques. Tools such as the Arduino IDE and NodeMCU/ESP8266 are included, with optional modules on cloud notifications and email alerts.
                                    </span>
                                </div>


                                {/* Button - white background, full width, centered text */}
                                <Link
                                    to="/course1"
                                    className="flex justify-center items-center gap-2 w-fit mx-auto rounded-2xl border border-gray-300 px-25 mt-5 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:text-gray-800 dark:border-gray-700 dark:text-gray-800 dark:hover:bg-white/10"
                                >
                                    Register Now
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Courses1;

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Upload from "../../../src/icons/Upload icon.png";
import Uploadafter from "../../../src/icons/OIP.webp";

function FileUploadBox() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
    });

    const handleDelete = () => setSelectedFile(null);

    if (selectedFile) {
        const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);

        return (
            <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[200px]">
                <div className="flex items-center gap-4">
                    <img src={Uploadafter} alt="Preview" className="h-12 w-12 object-contain" />
                    <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{fileSizeMB} MB</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="text-gray-500 hover:text-red-500 transition"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        );
    }

    return (
        <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 h-[200px]">
            <form
                {...getRootProps()}
                className={`dropzone h-full rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${isDragActive
                    ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                id="demo-upload"
            >
                <input {...getInputProps()} />
                <div className="dz-message flex flex-col justify-center items-center text-center h-full gap-2">
                    {/* Icon Container */}
                    <div className="flex justify-center items-center">
                        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                            <img src={Upload} alt="Upload Icon" className="h-12 w-12 object-contain" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="max-w-[400px]">
                        <h6 className="mb-2 text-sm font-sl text-gray dark:text-white/90">
                            {isDragActive ? "Drop Files or" : "Drag & Drop Files or"}{" "}
                            <span className="font-medium underline text-brand-500 text-xs">
                                Browse File
                            </span>
                        </h6>

                        <span className="block text-sm text-gray-700 dark:text-gray-400">
                            Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
                        </span>
                    </div>
                </div>

            </form>
        </div>
    );
}
