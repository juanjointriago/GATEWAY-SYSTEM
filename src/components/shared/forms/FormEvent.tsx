import { useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useForm } from "react-hook-form";
import { event, students, subLevel } from "../../../interface";
// import { useEventStore } from "../../../stores/events/event.store"
import { v4 as uuid } from 'uuid'
import { useLevelStore, useSubLevelStore, useUserStore } from "../../../stores";


export const FormEvent = () => {
  // const createEvent = useEventStore(state => state.createEvent);
  const animatedComponents = makeAnimated();
  const defaultValues: event = {
    id: '',
    name: '',
    date: 0,
    teacher: '',
    levels: { level: '', sublevels: [] },
    students: {},
    status: '',
    isActive: true,
    maxAssistantsNumber: 10,
    minAssistantsNumber: 1,
    limitDate: 0,
    meetLink: '',
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<event>({ defaultValues })
  const [levelEvent, setLevelEvent] = useState<string>();
  console.log(levelEvent)
  const [subLevelslEvent, setSubLevelslEvent] = useState<subLevel[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedSublevels, setSelectedSublevels] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [aditionalStudents, setAditionalStudents] = useState<any[]>([])

  const levels = useLevelStore(state => state.levels);
  const sublevels = useSubLevelStore(state => state.sublevels);
  const users = useUserStore(state => state.users);

  const onSubmit = handleSubmit(async (data: event) => {
    if (!levelEvent) return;
    data.levels.level = levelEvent;
    if ((sublevels.length === 0) && (selectedSublevels.length === 0)) return;
    const sublevelsToSave: string[] = selectedSublevels.map((sublevel) => sublevel.value);
    data.levels.sublevels = sublevelsToSave;
    // const aditionalStudentsToSave: students = aditionalStudents.map((aditionalStd) => ({ [aditionalStd.value]: { status: 'COMMING' } }));
    const aditionalStudentsToSave: students = aditionalStudents.reduce((acc, curr) => ({ ...acc, [curr.value]: { status: 'COMMING' } }), {});
    console.log(aditionalStudentsToSave)
    const studentByLevel = users.map((user) => { if (sublevelsToSave.includes(user.subLevel!)) { return { [user.id!]: { status: 'COMMING' } } } });
    const studentsToSave = studentByLevel.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    const allstudents = { ...studentsToSave, ...aditionalStudentsToSave };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.students = allstudents as any;
    if (data.teacher) {
      data.meetLink = users.find((user) => user.id === data.teacher)!.teacherLink!;
      const unitRecord = { id: uuid(), ...data }
      // await createEvent(unitRecord);
      console.log({ unitRecord })
      reset();
    }
  })
  return (
    <div className="flex">
      <form className=" flex w-full max-w-lg" onSubmit={onSubmit}>
        <div className="flex flex-wrap mx-3 mb-6">
          {/*Name*/}
          <div className="w-full md:w-1/1 px-3 mb-6 md:mb-0">
            <label htmlFor="name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Nombre</label>
            <input
              {...register("name", { required: "El nombre es obligatorio 👀", })}
              id="name"
              type="text"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              placeholder="Ej. Clases 10:30 - 11:30" />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
          </div>
          {/*MaxAssitantNumber*/}
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="maxAssistantsNumber">
              Número máximo de estudiantes *
            </label>
            <input
              {...register("maxAssistantsNumber", { required: "El maximo de estudiantes es obligatorio👀" })}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="maxAssistantsNumber"
              type="number" maxLength={10} minLength={1} />
            {errors.maxAssistantsNumber && <p className="text-red-500 text-xs italic">{errors.maxAssistantsNumber.message}</p>}
          </div>
          {/*MinAssitantNumber*/}
          <div className="mb-3 md:w-1/1 px-3 mt-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="minAssistantsNumber">
              Número mínimo de estudiantes *
            </label>
            <input
              {...register("minAssistantsNumber", { required: "El minimo de estudiantes es obligatorio👀" })}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="minAssistantsNumber"
              type="number" maxLength={10} minLength={1} />
            {errors.minAssistantsNumber && <p className="text-red-500 text-xs italic">{errors.minAssistantsNumber.message}</p>}
          </div>
          {/*Teacher*/}
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            <Select
              components={animatedComponents}
              defaultValue={''}
              placeholder="Teacher"
              isMulti
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              options={users.filter(user => user.role === 'teacher').map(user => ({ value: user.id, label: user.name }))}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => {
                console.log(' TEACHER-ID', e);
                if (!e) return
                setAditionalStudents(e)
              }}
            />
          </div>
          {/*Level*/}
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            <Select
              components={animatedComponents}
              defaultValue={''}
              placeholder="Modalidad"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              options={levels.map(level => ({ value: level.id, label: level.name })) as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => {
                console.log('LEVELID', e.value);
                if (!e.value) return
                setLevelEvent(e.value);
                const sublv = sublevels.filter((sublevel) => sublevel.parentLevel === e.value);
                if (sublv) setSubLevelslEvent(sublv);
              }}
            />
          </div>
          {/*SubLevels*/}
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            <div className="bg-indigo-300 w-[auto] rounded-sm ">
            </div>
            <Select
              id="sublevels"
              defaultValue={''}
              components={animatedComponents}
              placeholder="Unidad "
              isMulti
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              options={subLevelslEvent.map(sublevel => ({ value: sublevel.id, label: sublevel.name })) as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => {
                console.log('SUB-LEVELID', { e });
                setSelectedSublevels(e)
              }}
            />
          </div>
          {/*Aditional Student*/}
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            <Select
              components={animatedComponents}
              defaultValue={''}
              placeholder="Estudiantes adicionales"
              isMulti
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              options={users.map(user => ({ value: user.id, label: user.name })) as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => {
                // if (!environment.production) return
                console.log(' STUDENT-ADITIONAL-ID', e);
                if (!e) return
                setAditionalStudents(e)
              }}
            />
          </div>
          {/*SelectTime*/}
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            <label htmlFor="time" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Hora</label>
            <input type="time" id="time" value="00:00" required />
          </div>
        </div>
        {/*Submit button*/}
        <div className="flex h-[10%] justify-`end` ]">
          <button
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-5 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 mr-11"
            type="submit"
          >💾</button>
        </div>
      </form>
    </div>
  )
}
