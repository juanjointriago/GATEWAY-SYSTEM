import { useForm } from "react-hook-form";
import { event, students, subLevel } from "../../../interface";
import { useEventStore } from "../../../stores/events/event.store"
import { v4 as uuid } from 'uuid'
import { useLevelStore, useSubLevelStore, useUserStore } from "../../../stores";
import { useState } from "react";
import { environment } from '../../../../environment'


export const FormEvent = () => {
  const createEvent = useEventStore(state => state.createEvent);
  const defaultValues: event = {
    id: '',
    name: '',
    date: 0,
    teacher: '',
    levels: { level: '', sublevels: [] },
    students: {},
    status: '',
    isActive: true,
    maxAssistantsNumber: 0,
    minAssistantsNumber: 0,
    limitDate: 0,
    meetLink: '',
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<event>({ defaultValues })
  const [levelEvent, setLevelEvent] = useState<string>();
  const [subLevelslEvent, setSubLevelslEvent] = useState<subLevel[]>([]);
  const [selectedSublevels, setSelectedSublevels] = useState<string[]>([]);
  const [aditionalStudents, setAditionalStudents] = useState<students[]>()

  const levels = useLevelStore(state => state.levels);
  const sublevels = useSubLevelStore(state => state.sublevels);
  const users = useUserStore(state => state.users);

  const onSubmit = handleSubmit(async (data: event) => {
    if (!levelEvent) return;
    data.levels.level = levelEvent;
    if ((sublevels.length === 0) && (selectedSublevels.length === 0)) return;
    data.levels.sublevels = selectedSublevels;
    const unitRecord = { id: uuid(), ...data }
    await createEvent(unitRecord);
    console.log({ data })
    reset();
  })
  return (
    <div className="flex">
      <form className=" flex w-full max-w-lg" onSubmit={onSubmit}>
        <div className="flex flex-wrap mx-3 mb-6 bg-slate-500">
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
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
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
          {/*Level*/}
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            {/*TODO select level and render sublevels */}
            <select
              id="levels"
              defaultValue={''}
              onChange={(e) => {
                console.log('LEVELID', e.target.value);
                setLevelEvent(e.target.value);
                const sublv = sublevels.filter((sublevel) => sublevel.parentLevel === e.target.value);
                if (sublv) setSubLevelslEvent(sublv);
              }}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white">
              <option value={''}>Seleccione la Modalidad</option>
              {
                levels.map((level) => {
                  return <option key={level.id} value={level.id}>{level.name}</option>
                })
              }
            </select>
          </div>
          {/*SubLevels*/}
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            <div className="bg-indigo-300 w-[auto] rounded-sm ">
              {
                //selected sublevels
                selectedSublevels && selectedSublevels.map((sublevel) => (
                  <span key={sublevel} className="px-2.5 py-0.5 mt-2 mb-2 ml-2 mr-1 items-center rounded-full bg-indigo-700 text-white text-xs">
                    {sublevels.find((item) => item.id === sublevel)!.name + '   '} <span
                      onClick={() => { 
                        console.log('Quit selected sublevels', sublevels.find((item) => item.id === sublevel)!.id);
                        setSelectedSublevels(selectedSublevels => [...selectedSublevels.filter((item) => item !== sublevel)])
                        setSubLevelslEvent(subLevelslEvent => [...subLevelslEvent, sublevels.find((item) => item.id === sublevel)!])
        
                      }}
                      className="bg-slate-100 text-black h-2 w-min-[3] rounded-full justify-center items-center">x</span>
                  </span>
                ))
              }
            </div>
            <select
              id="sublevels"
              defaultValue={''}
              onChange={(e) => {
                // console.log('SUB-LEVELID', e.target.value);
                setSelectedSublevels(selectedSublevels => [...selectedSublevels, sublevels.find(sublevel => sublevel.id === e.target.value)!.id!])
                setSubLevelslEvent(subLevelslEvent => subLevelslEvent.filter(sublevel => sublevel.id !== e.target.value))
              }}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white">
              <option value={''}>Seleccione la Unidad</option>
              {
                subLevelslEvent?.map((level) => {
                  return <option key={level.id} value={level.id}>{level.name}</option>
                })
              }
            </select>
          </div>
          {/*Aditional Student*/}
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            {/*TODO select level and render sublevels */}
            <div className="bg-indigo-300 w-[auto]">
              {
                //selected aditional users
                environment.production &&
                aditionalStudents && aditionalStudents.map((student) => (
                  <span key={Object.keys(student)[0]} className="px-2 py-0.5 mt-2 mb-2 ml-1 mr-1 items-center  rounded-full bg-indigo-700 text-white text-xs">{users.find((item) => item.id === Object.keys(student)[0])!.name}</span>
                ))
              }
            </div>
            <select
              id="students"
              defaultValue={''}
              onChange={(e) => {
                if (!environment.production) return
                console.log(' STUDENT-ADITIONAL-ID', e.target.value);
                // setSelectedSublevels(selectedSublevels => [...selectedSublevels, sublevels.find(sublevel => sublevel.id === e.target.value)!.id!])
                // setSubLevelslEvent(subLevelslEvent => subLevelslEvent.filter(sublevel => sublevel.id !== e.target.value))
                setAditionalStudents(aditionalStudents => [...aditionalStudents!, { [e.target.value]: { status: 'COMMING' } }])
              }}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white">
              <option value={''}>Estudiante adicional</option>
              {
                users?.map((user) => {
                  return <option key={user.id} value={user.id}>{user.name}</option>
                })
              }
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}
