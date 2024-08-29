import { FC, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Controller, useForm } from "react-hook-form";
import { event, students } from "../../../interface";
import { useEventStore } from "../../../stores/events/event.store"
import { v6 as uuid } from 'uuid'
import { useLevelStore, useSubLevelStore, useUserStore } from "../../../stores";
import Swal from "sweetalert2";
import { sendCustomEmail } from "../../../store/firebase/helper";


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

    const onSubmit = handleSubmit(async (data: event) => {
        // if (!levelEvent) return;
        // data.levels[0] = { level: getValues('levels.0.level'), subLevels:  };
        // const aditionalStudentsToSave: students = aditionalStudents.map((aditionalStd) => ({ [aditionalStd.value]: { status: 'COMMING' } }));
        const aditionalStudentsToSave: students = aditionalStudents.reduce((acc, curr) => ({ ...acc, [curr.value]: { status: 'COMMING' } }), {});
        console.log(aditionalStudentsToSave)
        // const studentByLevel = students.map((user) => { if (sublevelsToSave.includes(user.subLevel!)) { return { [user.id!]: { status: 'COMMING' } } } });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.levels[0].subLevels = data.levels[0].subLevels.map((sublevel: any) => sublevel.value)
        const studentByLevel = students.map((student) => { if (data.levels[0].subLevels.includes(student.subLevel!)) { return { [student.id!]: { status: 'COMMING' } } } });
        console.log('👀FOUND STUDENTS ===> ', { studentByLevel });
        const studentsToSave = studentByLevel.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        const allstudents = { ...studentsToSave, ...aditionalStudentsToSave };
        data.students = allstudents as students;//change for STUDENTS
        // if (!data.teacher) return;
        if (data.teacher) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newTeacher = data.teacher as any
            data.teacher = newTeacher.value;
            data.meetLink = teachers.find((user) => user.id === data.teacher) ? teachers.find((user) => user.id === data.teacher)?.teacherLink : null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newLevel = data.levels[0].level as any;
            data.levels[0].level = newLevel.value;
            const eventRecord = { id: uuid(), ...data }
            //loading swal 
            console.log({ eventRecord });
            await sendCustomEmail({
                to: [getUserById(data.teacher!)!.email!],
                message: {
                    subject: 'Recordatorio de reservación',
                    text: `Hola, ${getUserById(data.teacher!)!.name}, se ha asignado un nuevo horario con fecha y hora : ${new Date(eventRecord.date).toLocaleTimeString([], {year: '2-digit', month: "2-digit", day: '2-digit', hour: '2-digit', minute: '2-digit'})} con el nombre de ${eventRecord.name}, con estudiantes de la(s) unidad(es) ${eventRecord.levels[0].subLevels.map(sublevel => sublevels.find(sub => sub.id === sublevel)?.name).join(', ')}, en modalida de ${levels.find((level) => level.id === eventRecord.levels[0].level)?.name}.`,
                    html: `<h1>Hola, ${getUserById(data.teacher!)!.name}</h1>
                    <p>Te recordamos que tienes una reservación el ${new Date(eventRecord.date).toLocaleDateString()} a las ${new Date(eventRecord.date).toLocaleTimeString()} con el nombre de ${eventRecord.name}
                    , con estudiantes de la(s) unidad(es) <b>${eventRecord.levels[0].subLevels.map(sublevel => sublevels.find(sub => sub.id === sublevel)?.name).join(', ')}</b>, en modalidad <b>${levels.find((level) => level.id === eventRecord.levels[0].level)?.name}<b/>.
                    </p>
                    <a href="https://gateway-english.com">
                        <p> © 2024 Gateway Corp derechos reservados </p>
                        <table width="100%" style="max-width:640px;">
                        <tr>
                        <td>
                        <img width="100%" src='https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/gateway-assets%2Flogo.png?alt=media&token=1402510d-7ad8-4831-a20e-727191800fcd'/>
                          </td>
                        </tr>
                      </table>
                        <br/>
                        <small>Creado por: Purple-Widget - Software a medida - +(593)987357965</small>
                        <img style="max-width:100%;height:auto;" src='https://firebasestorage.googleapis.com/v0/b/zustand-practice-e2ec6.appspot.com/o/purplewidgetlogo.png?alt=media&token=9673f9b9-8b45-4ff0-a931-c0e6b4b72f01'/>
                    </a>`
                },

            })
            return;
            Swal.fire({
                title: 'Creando Reservación',
                html: 'Espere un momento por favor',
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()  //swal loading
                },
            })
            await createEvent(eventRecord).then(() => {
                // console.log('ITS ok');
                Swal.fire({
                    title: 'Reservación creada',
                    text: `Reservación creada con éxito`,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                })

            }).catch((error) => {
                Swal.fire('Error', `${error.message}`, 'error');
                console.error(error);
            });
            // reset(defaultValues);

        }
    })
    return (
        <div className="flex">
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
                        <Controller
                            rules={{ required: "El docente es obligatorio 👀" }}
                            control={control}
                            name="teacher"
                            render={({ field: { onChange, onBlur, ref, name } }) => (

                                <Select
                                    name={name}
                                    id={name}
                                    // {...field}
                                    components={animatedComponents}
                                    // defaultInputValue={defaultValues.teacher ? getUserByRole('teacher')?.find(user => user.id === defaultValues.teacher)?.name : 'Profesor'}
                                    // isMulti
                                    options={teachers && teachers.map(teacher => ({ value: teacher.id, label: teacher.name }))}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
                        <div className="bg-indigo-300 w-[auto] rounded-sm ">
                        </div>
                        <Controller
                            rules={{ required: "La(s) unidad(es) es(son) obligatoria(s) 👀" }}
                            control={control}
                            name="levels.0.subLevels"
                            render={({ field: { onBlur, onChange, ref, name } }) => (
                                // console.log(getValues("levels.0.level")),
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
                                //     console.log('SUB-LEVELID', { e });
                                //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                //     setValue('levels.0.subLevels', e);
                                // }}
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
                                console.log(' STUDENT-ADITIONAL-ID', e);
                                if (!e) return
                                setAditionalStudents(e)
                            }}
                        />
                    </div>
                    {/*SelectTime*/}
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
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
                    <div className="w-full md:w-1/1 mt-2 px-3">
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
                {/*Submit button*/}
                <div className="flex h-[4rem] w-[4rem] justify-`end` ]">
                    <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-5 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 mr-11"
                        type="submit"
                    >💾</button>
                </div>
            </form>
        </div>
    )
}
