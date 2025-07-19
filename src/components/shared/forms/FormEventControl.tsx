import { FC, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Controller, useForm } from "react-hook-form";
import { event, students } from "../../../interface";
import { useEventStore } from "../../../stores/events/event.store"
import { v6 as uuid } from 'uuid'
import { useLevelStore, useSubLevelStore, useUserStore } from "../../../stores";
import CustomModal from "../../../components/CustomModal";
import { footerMail, sendCustomEmail } from "../../../store/firebase/helper";


export const FormEventControl: FC = () => {
    const createEvent = useEventStore(state => state.createEvent);
    const animatedComponents = makeAnimated();
    const defaultValues: event = {
        name: '',
        date: 0,
        teacher: '',
        levels: [{ level: '', subLevels: [] }],
        students: {},
        status: 'COMMING',
        isActive: true,
        maxAssistantsNumber: 10,
        minAssistantsNumber: 1,
        limitDate: 0,
        meetLink: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }

    const { control, handleSubmit, formState: { errors } } = useForm<event>({ defaultValues })
    // const [levelEvent, setLevelEvent] = useState<string>('');
    // const [subLevelslEvent, setSubLevelslEvent] = useState<subLevel[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [aditionalStudents, setAditionalStudents] = useState<any[]>([])
    const levels = useLevelStore(state => state.levels);
    const sublevels = useSubLevelStore(state => state.subLevels);
    const getUserByRole = useUserStore(state => state.getUserByRole);
    const getUserById = useUserStore(state => state.getUserById);
    const students = getUserByRole('student')!.filter((student) => student.isActive);
    const teachers = [...getUserByRole('teacher')!, ...getUserByRole('admin')!].filter((user) => user.isActive);

    // Estados para CustomModal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<'warn' | 'info' | 'danger' | 'success'>("info");
    const [modalAction, setModalAction] = useState<() => Promise<void> | void>(() => {});
    const [modalCancelable, setModalCancelable] = useState<boolean>(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackTitle, setFeedbackTitle] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState<'warn' | 'info' | 'danger' | 'success'>("info");

    const showModal = (title: string, message: string, type: 'warn' | 'info' | 'danger' | 'success', action?: () => Promise<void> | void, cancelable = false) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalType(type);
        setModalAction(() => action || (() => setModalOpen(false)));
        setModalCancelable(cancelable);
        setModalOpen(true);
    };

    const showFeedback = (title: string, message: string, type: 'warn' | 'info' | 'danger' | 'success') => {
        setFeedbackTitle(title);
        setFeedbackMessage(message);
        setFeedbackType(type);
        setFeedbackOpen(true);
    };

    const onSubmit = handleSubmit(async (data: event) => {
        // if (!levelEvent) return;
        // data.levels[0] = { level: getValues('levels.0.level'), subLevels:  };
        // const aditionalStudentsToSave: students = aditionalStudents.map((aditionalStd) => ({ [aditionalStd.value]: { status: 'COMMING' } }));
        const aditionalStudentsToSave: students = aditionalStudents.reduce((acc, curr) => ({ ...acc, [curr.value]: { status: 'COMMING' } }), {});
        console.debug(aditionalStudentsToSave)
        // const studentByLevel = students.map((user) => { if (sublevelsToSave.includes(user.subLevel!)) { return { [user.id!]: { status: 'COMMING' } } } });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.levels[0].subLevels = data.levels[0].subLevels.map((sublevel: any) => sublevel.value)
        const studentByLevel = students.map((student) => { if (data.levels[0].subLevels.includes(student.subLevel!)) { return { [student.id!]: { status: 'COMMING' } } } });
        console.debug('👀FOUND STUDENTS ===> ', { studentByLevel });
        const studentsToSave = studentByLevel.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        const allstudents = { ...studentsToSave, ...aditionalStudentsToSave };
        data.students = allstudents as students;//change for STUDENTS
        // if (!data.teacher) return;
        if (data.teacher) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newTeacher = data.teacher as any;
            data.teacher = newTeacher.value;
            data.meetLink = teachers.find((user) => user.id === data.teacher) ? teachers.find((user) => user.id === data.teacher)?.teacherLink : null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newLevel = data.levels[0].level as any;
            data.levels[0].level = newLevel.value;
            const eventRecord = { id: uuid(), ...data };
            showModal(
                'Creando Reservación',
                'Espere un momento por favor',
                'info',
                async () => {
                    setModalOpen(false);
                    try {
                        await createEvent(eventRecord);
                        showFeedback('Reservación creada', 'Reservación creada con éxito', 'success');
                        // Enviar correo
                        const text = `Se le ha asignado un horario de clase con fecha y hora : ${new Date(data.date).toLocaleTimeString([], { year: '2-digit', month: "2-digit", day: '2-digit', hour: '2-digit', minute: '2-digit' })} con el nombre de ${data.name}, con estudiantes de la(s) unidad(es) ${data.levels[0].subLevels.map(sublevel => sublevels.find(sub => sub.id === sublevel)?.name).join(', ')}, en modalidad de ${levels.find((level) => level.id === data.levels[0].level)?.name}.`;
                        await sendCustomEmail({
                            to: [getUserById(data.teacher!)!.email!],
                            message: {
                                subject: 'Asignación de horario de clase',
                                text: `Hola, ${getUserById(data.teacher!)!.name} ${text}`,
                                html: `<h1>Hola, ${getUserById(data.teacher!)!.name}</h1> <p>${text}</p> ${footerMail}`
                            },
                        });
                        setTimeout(() => window.location.reload(), 1200);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (error: any) {
                        showFeedback('Error', error.message || 'Ocurrió un error al crear la reservación.', 'danger');
                        console.error(error);
                    }
                },
                false
            );
        }
    })
    return (
        <>
            <CustomModal
                isOpen={modalOpen}
                title={modalTitle}
                message={modalMessage}
                type={modalType}
                onConfirm={modalAction}
                onCancel={modalCancelable ? () => setModalOpen(false) : undefined}
            />
            <CustomModal
                isOpen={feedbackOpen}
                title={feedbackTitle}
                message={feedbackMessage}
                type={feedbackType}
                onConfirm={() => setFeedbackOpen(false)}
            />
            <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mt-4 border border-gray-200">
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div className="flex flex-wrap -mx-2">
                    {/*Name*/}
                    <div className="w-full px-2 mb-4">
                        <label htmlFor="name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Nombre</label>
                        <Controller
                            rules={{ required: "El nombre es obligatorio 👀" }}
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <input
                                    id="name"
                                    {...field}
                                    type="text"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                    placeholder="Ej. Clases 10:30 - 11:30" />
                            )}
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                    </div>
                    {/*MaxAssitantNumber*/}
                    <div className="w-full px-2 mb-4">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="maxAssistantsNumber">  Número máximo de estudiantes * </label>
                        <Controller
                            rules={{ required: "Se requiere un maximo de sistentes 👀" }}
                            control={control}
                            name="maxAssistantsNumber"
                            render={({ field }) => (
                                <input
                                    {...field}

                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="maxAssistantsNumber"
                                    type="number" maxLength={10} minLength={1} />
                            )}
                        />
                        {errors.maxAssistantsNumber && <p className="text-red-500 text-xs italic">{errors.maxAssistantsNumber.message}</p>}
                    </div>
                    {/*MinAssitantNumber*/}
                    <div className="w-full px-2 mb-4">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="minAssistantsNumber">
                            Número mínimo de estudiantes *
                        </label>
                        <Controller
                            rules={{ required: "El minimo de estudiantes es obligatorio 👀" }}
                            control={control}
                            name="minAssistantsNumber"
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="minAssistantsNumber"
                                    type="number" maxLength={10} minLength={1} />
                            )}
                        />
                        {errors.minAssistantsNumber && <p className="text-red-500 text-xs italic">{errors.minAssistantsNumber.message}</p>}
                    </div>
                    {/*Teacher*/}
                    <div className="w-full px-2 mb-4">
                        <Controller
                            rules={{ required: "El docente es obligatorio 👀" }}
                            control={control}
                            name="teacher"
                            render={({ field: { onChange, onBlur, ref, name } }) => (

                                <Select
                                    name={name}
                                    id={name}
                                    ref={ref}
                                    // {...field}
                                    components={animatedComponents}
                                    // defaultInputValue={defaultValues.teacher ? getUserByRole('teacher')?.find(user => user.id === defaultValues.teacher)?.name : 'Profesor'}
                                    // isMulti
                                    options={teachers && teachers.map(teacher => ({ value: teacher.id, label: teacher.name }))}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    onChange={onChange}
                                    placeholder="Profesor"
                                    onBlur={onBlur}
                                />
                            )}
                        />
                        {errors.teacher && <p className="text-red-500 text-xs italic">{errors.teacher.message}</p>}
                    </div>
                    {/*Level*/}
                    <div className="w-full px-2 mb-4">
                        <Controller
                            rules={{ required: "La modalidad es obligatoria 👀" }}
                            control={control}
                            name="levels.0.level"
                            render={({ field: { onChange, onBlur, ref, name } }) => (
                                <Select
                                    // {...field}
                                    ref={ref}
                                    name={name}
                                    id={name}
                                    components={animatedComponents}
                                    placeholder="Modalidad"
                                    options={levels.map(level => ({ value: level.id, label: level.name }))}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                // onChange={(e: any) => {
                                //     setValue('levels.0.level', e.value);
                                //     if (!e.value) return
                                //     setLevelEvent(e.value);
                                // }}
                                />
                            )}
                        />
                        {errors.levels && errors.levels[0]?.level && <p className="text-red-500 text-xs italic">{errors.levels[0].level.message}</p>}
                    </div>
                    {/*SubLevels*/}
                    <div className="w-full px-2 mb-4">
                        <div className="bg-indigo-300 w-[auto] rounded-sm ">
                        </div>
                        <Controller
                            rules={{ required: "La(s) unidad(es) es(son) obligatoria(s) 👀" }}
                            control={control}
                            name="levels.0.subLevels"
                            render={({ field: { onBlur, onChange, ref, name } }) => (
                                // console.debug(getValues("levels.0.level")),
                                <Select
                                    // {...field}
                                    ref={ref}
                                    name={name}
                                    id={name}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    components={animatedComponents}
                                    isMulti
                                    placeholder="Unidades"
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    options={sublevels.map(sublevel => ({ value: sublevel.id, label: sublevel.name })) as any}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                // onChange={(e: any) => {
                                //     console.debug('SUB-LEVELID', { e });
                                //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                //     setValue('levels.0.subLevels', e);
                                // }}
                                />
                            )}
                        />
                    </div>
                    {/*Aditional Student*/}
                    <div className="w-full px-2 mb-4">
                        <Select
                            components={animatedComponents}
                            placeholder="Estudiantes adicionales"
                            isMulti
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            options={students.map(student => ({ value: student.id, label: student.name })) as any}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onChange={(e: any) => {
                                console.debug(' STUDENT-ADITIONAL-ID', e);
                                if (!e) return
                                setAditionalStudents(e)
                            }}
                        />
                    </div>
                    {/*SelectTime*/}
                    <div className="w-full px-2 mb-4">
                        <label htmlFor="date-time" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">FEcha y hora</label>
                        <Controller
                            rules={{ required: "Debe seleccionar fecha y hora de reservación 👀" }}
                            control={control}
                            name="date"
                            render={({ field }) => (
                                <input
                                    required
                                    {...field}
                                    type="datetime-local" id="date"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                />
                            )}
                        />
                        {errors.date && <p className="text-red-500 text-xs italic">{errors.date.message}</p>}
                    </div>
                    {/*Limit Date*/}
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
                        <label htmlFor="limit-date" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Límite de aprobación de estudiantes </label>
                        <Controller
                            rules={{ required: "Debe seleccionar fecha y hora limite de aprobdación 👀" }}
                            control={control}
                            name="limitDate"
                            render={({ field }) => (
                                <input
                                    required
                                    {...field}
                                    type="datetime-local" id="limit-date"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                />
                            )}
                        />
                        {errors.limitDate && <p className="text-red-500 text-xs italic">{errors.limitDate.message}</p>}
                    </div>
                    {/*IsActive*/}
                    <div className="w-full px-2 mt-2 mb-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <Controller
                                rules={{ required: "Este campo debe registrarse por primera vez como Activo 👀" }}//justneed those for create or not?
                                control={control}
                                name="isActive"
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <input
                                        onBlur={onBlur}
                                        onChange={() => onChange(!value)}
                                        checked={value}
                                        ref={ref}
                                        id="isActive"
                                        type="checkbox"
                                        className="sr-only peer"

                                    />
                                )}
                            />

                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Activo</span>
                        </label>
                        {errors.isActive && <p className="text-red-500 text-xs italic">{errors.isActive.message}</p>}
                    </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            className="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none transition-all duration-150"
                            type="submit"
                        >
                            <span className="mr-2">💾</span> Guardar reservación
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
