import { FC, useState } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";


interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
}
export const SelectMultiple:FC<Props> = ({ data }) => {
    const [selectData, setSelectData] = useState(data[0]);
    const [query, setQuery] = useState('');
    const filteredData =
    query === ''
    ? data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : data.filter((item: any) => {
        return item.name.toLowerCase().includes(query.toLowerCase())
    });
    
    // console.debug('DATA', data)
    console.debug('Filtered', filteredData)
    return (
        <Combobox value={selectData} onChange={setSelectData} onClose={() => setQuery('')}>
      <ComboboxInput
        aria-label="Assignee"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        displayValue={(item:any) => item?.name}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions anchor="bottom" className="border empty:invisible">
        {filteredData.map((item) => (
          <ComboboxOption key={item.id} value={item} className="group flex gap-2 bg-white data-[focus]:bg-blue-100">
            <IoCheckmarkDoneCircleOutline className="invisible size-5 group-data-[selected]:visible" />
            {item.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
    )
}
