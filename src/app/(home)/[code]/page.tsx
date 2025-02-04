
import ErrorState from "@/components/ErrorState";
import NotFound from "../[...not-found]/page";
import {  getAffiliateLinkByCode } from "./actions";
import RedirectPage from './RedirectPage';
import { getUser } from "@/actions/actions";

interface RedirectPageProps {
    params: { code: string };
}

export default async function Page({ params }: RedirectPageProps) {

    try {
        

    const { code } = params;
    const affiliateLink = await getAffiliateLinkByCode(code);
    const user = await getUser()

    if (!affiliateLink) {
        return <NotFound />;
    }
    else {
        return (
            <RedirectPage affiliateLink={affiliateLink} user={user}  />
        );
    }

} catch (error) {
    console.error(error);
    <ErrorState/>
        
}
}
