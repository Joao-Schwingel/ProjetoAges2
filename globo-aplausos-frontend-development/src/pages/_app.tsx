import '@/styles/globals.css';
import { appWithI18Next } from 'ni18n';
import { ni18nConfig } from '@/utils/ni18n.config';
import { UserProvider } from '@/contexts/userContext';
import { useEffect, useMemo } from 'react';
import TagManager, { TagManagerArgs } from 'react-gtm-module';

type AppProps = {
  Component: React.ComponentType<any>;
  pageProps: any;
};

function App({ Component, pageProps }: AppProps) {
  const gtmId = process.env.NEXT_GTM_ID || '';

  const tagManagerArgs: TagManagerArgs = useMemo(() => {
    return {
      gtmId
    };
  }, [gtmId]);

  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, [tagManagerArgs]);

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default appWithI18Next(App, ni18nConfig);
