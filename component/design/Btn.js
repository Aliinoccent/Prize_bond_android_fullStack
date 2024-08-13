import { Button } from "react-native";

export default function Btn({
    children
}) {
    return <Button>
        {children}
    </Button>
}

/*
    varient: light, green, blue, red
    <Btn>Hello World</Btn>
*/
