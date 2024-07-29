import * as React from 'react'
import { Metadata } from 'next/types';
import ChatMessage from '../../../components/ChatMessage';

export const metadata: Metadata = {
    title: "Semantic search",
};

const Page = (): React.ReactElement => {
    return (
        <ChatMessage />
    )
};

export default Page;