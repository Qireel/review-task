import {FC, FunctionComponent, useState, useEffect, useCallback, useRef, useReducer, ReactNode} from "react";
import { getRandomString } from "../utils/generateRandomString";

type Candidate = {
    id: string;
    name: string;
    salaryExpectations: number;
    profileLink: string;
}

type RowProps = {
    id: string;
    name: string;
    salaryExpectations: number;
    profileLink: string;
}

const BASE_DEVELOPER_RATE = 200000;

const candidates: Candidate[] = Array.from(Array(10000)).map(_ => ({
    id: getRandomString(5),
    name: getRandomString(10),
    salaryExpectations: Math.round(BASE_DEVELOPER_RATE + Math.random()*100000),
    profileLink: `https://linkedin.com/${getRandomString(5)}`
}));

export const useForceUpdate = () => useReducer(() => ({}), {})[1];

export const Row: FC<RowProps> = ({ id, name, salaryExpectations, profileLink}) => {
    const ref = useRef(null);
    const [observer, setObserver] = useState(null);

    useEffect(() => {
        setObserver(new IntersectionObserver(entries => {
            entries.forEach(item => {
                if (!item.isIntersecting) {
                    console.log(`Candidate ${name} is out of sight`);
                }
            })
        }, {
            threshold: 1
        }));
    }, []);

    useEffect(() => {
        observer?.observe(ref.current)
    }, [ref.current]);

    return (
        <div ref={ref} className={'row'}>
            <div>
                <a target='_blank' onClick={() => window.location.href = profileLink} style={{cursor: 'pointer'}}>{name}</a>
            </div>
            {
                salaryExpectations
                && (
                    <div>
                        {salaryExpectations} Р
                    </div>
                )
            }
        </div>
    );
}

type ListProps = {
    items: Candidate[];
}

export const List: FunctionComponent<ListProps> = ({ items }) => {
    const [candidatesQuantity, setQuantity] = useState(null);

    useEffect(() => {
        setQuantity(items.length);
    }, [items])

    return (
        <>
            <h4>List of candidates</h4>
            {!!candidatesQuantity && <h5>Quantity today: {candidatesQuantity}</h5>}
            <div className={'list'}>
                {
                    items.map((item, index) => {
                        if (index % 10 === 0) {
                            return (
                                <div className={'row'}>
                                    Candidate info is unavailable
                                </div>
                            );
                        }
                        return (
                            <Row {...item} />
                        );
                    })
                }
            </div>
        </>
    );
}

type JobInterviewProps = {
    children?: ReactNode;
}

export const JobInterview: FC<JobInterviewProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const forceUpdate = useForceUpdate();

    let result: Record<string, Candidate> = {};
    for(let i = 0; i < candidates.length; i++) {
        let userInfo = candidates[i];
        result[userInfo.id] = userInfo;
        if (Object.keys(result).length > 10)
            break;
    }
    let items = Object.values(result);

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);

        // Do some async stuff;
        new Promise(r => {
            setTimeout(r, 1000);
            forceUpdate();
        }).then(() => console.log('Async stuff is done'));

        setIsLoading(false);
    }, [isLoading])

    if (isLoading) {
        return (
            <h3>App is loading...</h3>
        );
    }

    return (
        <>
            <h3>Hiring CRM</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '30px'}}>
                <button onClick={handleRefresh} type='button'>
                    Refresh
                </button>
                <button type='button'>
                    Call HR
                </button>
            </div>
            <List items={items} />
            { children }
        </>
    );
}
