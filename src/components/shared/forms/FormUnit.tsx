import { useForm } from "react-hook-form";
import { unit } from "../../../interface";
import { useSubLevelStore, useUnitStore } from "../../../stores";
import { v4 as uuid } from 'uuid'
import { useRef, useState } from "react";

export const FormUnit = () => {
  const fileRef = useRef(null)
  const createUnit = useUnitStore(state => state.createUnit);
  const subLevels = useSubLevelStore(state => state.sublevels);
  const [fileIpload, setFileIpload] = useState<FileList | null>(null)
  const defaultValues: unit = {
    name: '',
    description: '',
    sublevel: '',
    photoUrl: '',
    // supportMaterial: '',
    workSheetUrl: '',
    isActive: false,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm<unit>({ defaultValues });
  const onSubmit = handleSubmit(async (data: unit) => {
    const unitRecord = { id: uuid(), ...data }
    if (fileIpload) {
      const inputFile = fileRef.current as HTMLInputElement | null;
      await createUnit(unitRecord, fileIpload[0]);
      console.log({ data })
      reset();
      inputFile!.value = ''
    }
  })

  return (
    <div className="flex ">
      <form className=" flex w-full max-w-lg" onSubmit={onSubmit}>

        <div className="flex flex-wrap mx-3 mb-6">
          <div className="w-full md:w-1/1 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
              Nombre *
            </label>
            <input
              {...register("name", { required: "El nombre es obligatorio 👀", })}
              id="name"
              type="text"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              placeholder="Ej. Unidad 1" />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
          </div>
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
              Descripción *
            </label>
            <input
              {...register("description", { required: "La descripción es obligatoria 👀" })}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="description"
              type="text"
              placeholder="Ej. Se da solo en las tardes" />
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}
          </div>
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="supportMaterial">
              Material de apoyo *
            </label>
            {/* <input
              {...register("supportMaterial", { required: "La descripción es obligatoria 👀" })}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="supportMaterial"
              type="text"
              placeholder="Aqui suba el enlace de material de apoyo" />
            {errors.supportMaterial && <p className="text-red-500 text-xs italic">{errors.supportMaterial.message}</p>}
          </div> */}
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              ref={fileRef}
              id="image"
              type="file"
              placeholder="Subir archivo"
              accept=".pdf"
              onChange={(e) => setFileIpload(e.target.files)}
              required
            />
            {errors.supportMaterial && <p className="text-red-500 text-xs italic">{errors.supportMaterial.message}</p>}
          </div>
          <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="workSheetUrl">
              Link de LiveWorkSheet *
            </label>
            <input
              {...register("workSheetUrl", { required: "La descripción es obligatoria 👀" })}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="workSheetUrl"
              type="text"
              placeholder="Aqui suba el enlace de material de apoyo" />
            {errors.workSheetUrl && <p className="text-red-500 text-xs italic">{errors.workSheetUrl.message}</p>}
          </div>

          <div className="w-full md:w-1/1 px-3 mb-6 md:mb-0">
            <label htmlFor="sublevel" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Sub-nivel al que pertenece</label>
            <select
              {...register("sublevel", { required: "El Sub-nivel es obligatorio 👀" })}
              id="sublevel"
              defaultValue={''}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white">
              <option value={''}>Seleccione un Sub-nivel</option>
              {
                subLevels.map((sublevel) => {
                  return <option key={sublevel.id} value={sublevel.id}>{sublevel.name}</option>
                })
              }
            </select>
            {errors.sublevel && <p className="text-red-500 text-xs italic">{errors.sublevel.message}</p>}
          </div>
          <div className="w-full md:w-1/1 mt-2 px-3">
            <label className="inline-flex items-center cursor-pointer">
              <input
                {...register("isActive", { required: "Este campo debe registrarse por primera vez como Activo 👀" })}
                id="isActive"
                type="checkbox"
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Activo</span>
            </label>
            {errors.isActive && <p className="text-red-500 text-xs italic">{errors.isActive.message}</p>}
          </div>
        </div>
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
