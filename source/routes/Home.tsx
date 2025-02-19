import React from 'react'
import { Group, Container, Title, Button } from '@mantine/core'

import { useAuth } from "../components/AuthProvider"
import WebGLCanvas from "../components/WebGLCanvas"
import "@/styles/Home.css"

const names = [
    [
        "Arobash",
        "Muraudim",
        "Horumak",
        "Dorimar",
        "Babark",
        "Oliwar",
        "Gryuwar",
        "Vanogri",
        "Felagh",
        "Gajener",
    ]
]

const nouns = [
    [ // items
        "Orb",
        "Sphere",
        "Staff",
        "Axe",
        "Blade",
        "Hound",
        "Golem",
        "Door",
        "Fleece",
        "Valley",
    ],
    [ // describers
        "Iron",
        "Light",
        "Darkness",
        "Steel",
        "Fire"
    ],
    [ // location names
        "Avernus",
        "Stormcrag",
        "Shadowvale",
        "Thornridge",
        "Ironcliff"
    ]
]

const adjectives = [
    "Golden",
    "Mystic",
    "Fiery",
    "Furious"
]


export default function Home() {
    const [cardName, setCardName] = React.useState<string>(generateName);
    const {
        authorized,
    } = useAuth();

    function generateOnClick() {
        setCardName(generateName());
    }


    function generateName() {
        function getRandomInt( max : number) {
            return Math.floor(Math.random() * max);
        }

        let resultString = "";
        const starter = getRandomInt(2);
        switch (starter) {
            // starts with a name
            case 0: {
                const raceId = getRandomInt(names.length);
                const race = names[raceId];

                const nameId = getRandomInt(race.length)
                const name = names[raceId][nameId];

                const locationId = getRandomInt(nouns[2].length);
                const location = nouns[2][locationId];
                resultString = `${name} of ${location}`;
            } break;
            // starts with the article "The"
            case 1: {
                const starter = getRandomInt(2);
                switch (starter) {
                    // starts with an item noun
                    case 0: {
                        const itemNounId = getRandomInt(nouns[0].length);
                        const itemNoun = nouns[0][itemNounId];

                        const nounType = getRandomInt(2) + 1;
                        const nounId = getRandomInt(nouns[nounType].length);
                        const noun = nouns[nounType][nounId];
                        resultString = `The ${itemNoun} of ${noun}`;
                    } break;
                    // starts with an adjective
                    case 1: {
                        const adjectiveId = getRandomInt(adjectives.length);
                        const adjective = adjectives[adjectiveId];

                        const nounId = getRandomInt(nouns[0].length);
                        const noun = nouns[0][nounId];
                        resultString = `The ${adjective} ${noun}`;
                    } break;
                }
            }
        }

        return resultString;
    }

    async function saveCard() {
        if (!authorized) { return }
        await fetch('api/save-card', {
            method: 'POST',
            body: JSON.stringify({
                name: cardName,
            })
        })
    }

    return (
        <Container fluid id={"canvas-container"}>
            <Title
                size={"3rem"}
            >{cardName}</Title>
            <WebGLCanvas />
            <Group>
                <Button
                    size={"lg"}
                    fullWidth={false}
                    variant={"subtle"}
                    onClick={generateOnClick}
                    color={"rgba(255, 255, 255, 1)"}>
                    Randomize
                </Button>
                <Button
                    size={"lg"}
                    fullWidth={false}
                    variant={"subtle"}
                    onClick={saveCard}
                    color={"rgba(255, 255, 255, 1)"}>
                    Save Card
                </Button>
            </Group>
        </Container>
    );
}