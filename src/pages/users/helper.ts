import { colors } from "../../theme/theme"

export const getInitials = (name: string) => {
    // console.log('👀 getInitials ======> ', { name });
    // return (name.split(" ").length > 1)
    //     ? `${name.split(" ")[0][0]
    //         ? name.split(" ")[0][0].toUpperCase()
    //         : "X"} ${(name.split(" ")[1][0].length !== 0) ? name.split(" ")[1][0].toUpperCase() : "X"}`
    //     : name ? name.slice(0, 1) : 'XX'
    return (name.split(" ").length > 1)
    ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
    : name.length > 2 ? name.slice(0, 1) : 'XX'
}

export const randomColor = () => colors[Math.floor(Math.random() * colors.length)]
