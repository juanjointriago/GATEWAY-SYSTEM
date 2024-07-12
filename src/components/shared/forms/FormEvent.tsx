import { useForm } from "react-hook-form";
import { event } from "../../../interface";
import { useEventStore } from "../../../stores/events/event.store"
import { v4 as uuid } from 'uuid'
import { SelectMultiple } from "../selectors/SelectMultiple";
import { useLevelStore } from "../../../stores";


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

  const levels = useLevelStore(state => state.levels);
  const onSubmit = handleSubmit(async (data: event) => {
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
          {/*Level And SubLevels*/}
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
          {/*TODO select level and render sublevels */}
          <SelectMultiple data={levels}/>
          </div>
        </div>
      </form>
    </div>
  )
}
