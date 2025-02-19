import {
    PasswordInput,
    TextInput,
    Button,
    Container,
    Flex,
    Group
} from "@mantine/core";
import {
    useForm,
    isNotEmpty
} from "@mantine/form";

// @ts-expect-error: for suppressing webstorm import errors. There isn't anything wrong
import "@/styles/Login.css"



export default function Login() {
    // Normal auth
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: null,
            password: null,
        },
        validate: {
            username: isNotEmpty("Please enter your username"),
            password: isNotEmpty("Please enter your password")
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log(code);

    // Function to redirect the user to the GitHub OAuth authorization page
    function redirectToGitHub() {
        const client_id = "Ov23lidioXyeboZ5JiQY";
        const redirect_uri = "http://127.0.0.1:3000/login/oauth2/code/github";
        const scope = "read:user";

        const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;

        window.location.href = authUrl;
    }

    return(
        <Container fluid id="login-container" className={"full-height"}>
            <Flex justify={"center"} direction={"column"}>
                <form onSubmit={form.onSubmit((values) => {
                    console.log(values);
                    const response = fetch("/user/login", {
                        method: "POST",
                        body: JSON.stringify(values),
                    });
                    console.log(response);
                })} className="login-form">
                    <div className="form-box">
                        <TextInput
                            withAsterisk
                            size={"lg"}
                            label="Username"
                            placeholder={"Username"}
                            key={form.key('username')}
                            {...form.getInputProps('username')}/>
                    </div>
                    <div className="form-box">
                        <PasswordInput
                            withAsterisk
                            size={"lg"}
                            label={"Password"}
                            placeholder={"Password"}
                            key={form.key('password')}
                            {...form.getInputProps('password')}/>
                    </div>
                    <div className="form-box" id="form-submission">
                        <Button
                            size={"md"}
                            type="submit">
                            Login
                        </Button>
                    </div>
                </form>
                <Flex direction={"row"} justify={"center"} gap={"1rem"}>
                    <Button
                        size={"md"}
                        type="submit"
                        onClick={redirectToGitHub}>
                        <Group gap={"1rem"}>
                            <svg height="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32" data-view-component="true">
                                <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
                            </svg>
                            Login with Github
                        </Group>
                    </Button>
                </Flex>
            </Flex>
        </Container>
    );
}
