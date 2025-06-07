import Select from 'react-select';
import makeAnimated from 'react-select/animated';


interface Props<T> {
    data: T[];
    defaultValue: T[];
    isMulti?: boolean;
    value: T[];
    setValue: React.Dispatch<React.SetStateAction<T[]>>
}


export const SelectOptionGeneric = <T,>({ data, defaultValue, isMulti, value, setValue }: Props<T>) => {
    const animatedComponents = makeAnimated();
    console.debug(value)
    return (
        <div>
            <Select
                components={animatedComponents}
                defaultValue={defaultValue}
                placeholder="Teacher"
                isMulti={isMulti}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                options={data.map((item: any) => ({ value: item.id, label: item.name }))}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e: any) => {
                    console.debug(' VALUE-ID', e.value);
                    if (!e) return
                    setValue(e.value)
                }}
            />
        </div>
    )
}
