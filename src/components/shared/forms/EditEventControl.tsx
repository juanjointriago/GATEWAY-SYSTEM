/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


import { useEventStore } from "../../../stores/events/event.store";
import { useLevelStore, useSubLevelStore, useUserStore } from "../../../stores";
import {
    event, students,
    // subLevel
} from "../../../interface";
import { Controller, useForm } from "react-hook-form";
import CustomModal from "../../../components/CustomModal";
import { footerMail, sendCustomEmail } from "../../../store/firebase/helper";
interface Props {
    eventId: string

}
export const EditEventControl: FC<Props> = ({ eventId }) => {
    const animatedComponents = makeAnimated();

    const editEvent = useEventStore(state => state.updateEvent);
    const getEventById = useEventStore(state => state.getEventById);
    const levels = useLevelStore(state => state.levels);
    // const getLevelById = useLevelStore(state => state.getLevelById);
    const sublevels = useSubLevelStore(state => state.subLevels);
    const getUserById = useUserStore(state => state.getUserById);
    const getUserByRole = useUserStore(state => state.getUserByRole);
    const students = getUserByRole('student').filter((student)=>student.isActive)!;
    const teachers = [...getUserByRole('teacher')!, ...getUserByRole('admin')!];
       const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<'warn' | 'info' | 'danger' | 'success'>('info');
    const [modalAction, setModalAction] = useState<() => Promise<void> | void>(() => {});

    // Obtener el evento y transformar valores para los selects
    const eventToEdit = getEventById(eventId);

    // Transformar teacher a { value, label }
    const teacherOption = eventToEdit && eventToEdit.teacher
        ? teachers.map(t => ({ value: t.id, label: t.name })).find(t => t.value === eventToEdit.teacher)
        : null;

    // Transformar level a { value, label }
    const levelOption = eventToEdit && eventToEdit.levels[0]?.level
        ? levels.map(l => ({ value: l.id, label: l.name })).find(l => l.value === eventToEdit.levels[0].level)
        : null;

    // Transformar subLevels a array de { value, label }
    const subLevelOptions = eventToEdit && eventToEdit.levels[0]?.subLevels?.map(subId => {
        const sub = sublevels.find(s => s.id === subId);
        return sub ? { value: sub.id, label: sub.name } : null;
    }).filter(Boolean);

    const defaultValues: event = eventToEdit ? {
        ...eventToEdit,
        teacher: teacherOption ? teacherOption.value ?? null : null,
        levels: [{
            level: levelOption && typeof levelOption.value === "string" ? levelOption.value : "",
            subLevels: subLevelOptions ? subLevelOptions.map(opt => opt!.value!).filter((v): v is string => typeof v === 'string') : []
        }],
        updatedAt: Date.now()
    } : {} as event;

    console.debug('EVENT TO EDIT ', { event: eventToEdit });

    const { control, handleSubmit, formState: { errors } } = useForm<event>({ defaultValues })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [aditionalStudents, setAditionalStudents] = useState<any[]>([]);

    // Estados para CustomModal

    if (!eventToEdit) {
        return (
            <div className="flex">
                <div>No se encontró el evento</div>
            </div>
        );
    }

    const onSubmit = handleSubmit(async (data: event) => {
        const aditionalStudentsToSave: students = aditionalStudents.reduce((acc, curr) => ({ ...acc, [curr.value]: { status: 'COMMING' } }), {});
        console.debug(aditionalStudentsToSave);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.levels[0].subLevels = data.levels[0].subLevels.map((sublevel: any) => sublevel.value)
        const studentByLevel = students.map((student) => { if (data.levels[0].subLevels.includes(student.subLevel!)) { return { [student.id!]: { status: 'COMMING' } } } });
        // console.debug(' EDIT FORM 👀 FOUND STUDENTS ===> ', { studentByLevel });
        const studentsToSave = studentByLevel.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        const allstudents = { ...studentsToSave, ...aditionalStudentsToSave };
        data.students = allstudents as students;//change for STUDENTS
        if (data.teacher) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newTeacher = data.teacher as any;
            data.teacher = newTeacher.value;
            data.meetLink = teachers.find((user) => user.id === data.teacher) ? teachers.find((user) => user.id === data.teacher)?.teacherLink : null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newLevel = data.levels[0].level as any;
            data.levels[0].level = newLevel.value;
            // console.debug('👀 level[0].level =>', data.levels[0].level);
            console.debug({ data });
            setModalTitle('Actualizando Reservación');
            setModalMessage('Espere un momento por favor');
            setModalType('info');
            setModalAction(() => async () => {}); // No acción en loading
            setModalOpen(true);
            try {
                await editEvent(data);
                setModalTitle('Reservación actualizada');
                setModalMessage('Reservación actualizada con éxito');
                setModalType('success');
                setModalAction(() => async () => {
                    const text = `Se ha actualizado el horario de clase con fecha y hora : ${new Date(data.date).toLocaleTimeString([], { year: '2-digit', month: "2-digit", day: '2-digit', hour: '2-digit', minute: '2-digit' })} con el nombre de ${data.name}, con estudiantes de la(s) unidad(es) ${data.levels[0].subLevels.map(sublevel => sublevels.find(sub => sub.id === sublevel)?.name).join(', ')}, en modalida de ${levels.find((level) => level.id === data.levels[0].level)?.name}.`;
                    await sendCustomEmail({
                        to: [getUserById(data.teacher!)!.email!],
                        message: {
                            subject: 'Actualizacion de horario de clase',
                            text: `Hola, ${getUserById(data.teacher!)!.name} ${text}`,
                            html: `<h1>Hola, ${getUserById(data.teacher!)!.name}</h1> <p>${text}</p>${footerMail}`
                        },
                    });
                    setModalOpen(false);
                    window.location.reload();
                });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setModalTitle('Error');
                setModalMessage(error.message || 'Ocurrió un error al actualizar la reservación');
                setModalType('danger');
                setModalAction(() => () => setModalOpen(false));
                console.error(error);
            }
        }

    })
    return (
        <div className="flex">
            <CustomModal
                isOpen={modalOpen}
                title={modalTitle}
                message={modalMessage}
                type={modalType}
                onConfirm={modalAction}
                onCancel={() => setModalOpen(false)}
            />
            <form className=" flex w-full max-w-lg" onSubmit={onSubmit}>
                <div className="flex flex-wrap mx-3 mb-6">
                    {/*Name*/}
                    <div className="w-full md:w-1/1 px-3 mb-6 md:mb-0">
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
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
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
                    <div className="mb-3 md:w-1/1 px-3 mt-2">
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
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
                        <p className="bg-indigo-300 w-[auto] rounded-sm ">
                            Datos actuales : {getUserById(defaultValues.teacher!)?.name ?? 'Profesor'}
                        </p>
                        <Controller
                            rules={{ required: "El docente es obligatorio 👀" }}
                            control={control}
                            name="teacher"
                            render={({ field: { onChange, onBlur, value, ref, name } }) => (
                                <Select
                                    name={name}
                                    id={name}
                                    components={animatedComponents}
                                    value={value}
                                    options={teachers.map(teacher => ({ value: teacher.id, label: teacher.name }))as any}
                                    onChange={onChange}
                                    placeholder="Profesor"
                                    onBlur={onBlur}
                                    ref={ref}
                                />
                            )}
                        />
                        {errors.teacher && <p className="text-red-500 text-xs italic">{errors.teacher.message}</p>}
                    </div>
                    {/*Level*/}
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
                        <p className="bg-indigo-300 w-[auto] rounded-sm">Datos actuales : {defaultValues.levels[0].level ? levels.find(level => level.id === defaultValues.levels[0].level)?.name : 'Modalidad'}</p>
                        <Controller
                            rules={{ required: "La modalidad es obligatoria 👀" }}
                            control={control}
                            name="levels.0.level"
                            render={({ field: { onChange, onBlur, value, ref, name } }) => (
                                <Select
                                    ref={ref}
                                    name={name}
                                    id={name}
                                    components={animatedComponents}
                                    value={value}
                                    placeholder="Modalidad"
                                    options={levels.map(level => ({ value: level.id, label: level.name }))as any }
                                    onBlur={onBlur}
                                    onChange={onChange}
                                />
                            )}
                        />
                        {errors.levels && errors.levels[0]?.level && <p className="text-red-500 text-xs italic">{errors.levels[0].level.message}</p>}
                    </div>
                    {/*SubLevels*/}
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
                        <p className="bg-indigo-300 w-[auto] rounded-sm ">
                            Datos actuales : {getEventById(eventId)?.levels[0].subLevels?.map(sublevel => sublevels.find(sub => sub.id === sublevel)?.name).join(' - ') ?? 'Unidades'}
                        </p>
                        <Controller
                            rules={{ required: "La(s) unidad(es) es(son) obligatoria(s) 👀" }}
                            control={control}
                            name="levels.0.subLevels"
                            render={({ field: { onBlur, onChange, value, ref, name } }) => (
                                <Select
                                    ref={ref}
                                    name={name}
                                    id={name}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    value={value}
                                    components={animatedComponents}
                                    isMulti
                                    placeholder="Unidades"
                                    options={sublevels.map(sublevel => ({ value: sublevel.id, label: sublevel.name })) as any}
                                />
                            )}
                        />
                    </div>
                    {/*Aditional Student*/}
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
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
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
                        <label htmlFor="date-time" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Fecha y hora</label>
                        <Controller
                            rules={{ required: "Debe seleccionar fecha y hora de reservación 👀" }}
                            control={control}
                            name="date"
                            render={({ field }) => (
                                <input
                                    required
                                    {...field}
                                    type="datetime-local" id="date"
                                    value={new Date(defaultValues.date).toISOString().substring(0, 16)}
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
                            // rules={{ required: "Debe seleccionar fecha y hora limite de aprobación 👀" }}
                            control={control}
                            name="limitDate"
                            render={({ field }) => (
                                <input
                                    // required
                                    {...field}
                                    value={defaultValues.limitDate && new Date(defaultValues.limitDate).toISOString().substring(0, 16)}
                                    type="datetime-local" id="limit-date"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                />
                            )}
                        />
                        {errors.limitDate && <p className="text-red-500 text-xs italic">{errors.limitDate.message}</p>}
                    </div>
                    {/*IsActive*/}
                    <div className="w-full md:w-1/1 mt-2 px-3">
                        <label className="inline-flex items-center cursor-pointer">
                            <Controller
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
                {/*Submit button*/}
                <div className="flex h-[4rem] w-[4rem] justify-`end` ]">
                    <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-5 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 mr-11"
                        type="submit"
                    >✎</button>
                </div>
            </form>
        </div>
    )
}
