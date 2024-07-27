export  const getInitials = (name: string) => {
    return (name.split(" ").length > 1)
        ? `${name.split(" ")[0][0].toUpperCase()}${name.split(" ")[1][0].toUpperCase()}`
        : name ? name.slice(0, 1) : 'XX'
}