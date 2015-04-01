import React from 'react';
import Drawer from 'mnmo-components/lib/themes/mnmo/drawer';
import List from 'mnmo-components/lib/themes/mnmo/list';
import LI from 'mnmo-components/lib/themes/mnmo/li';
import Switch from 'mnmo-components/lib/themes/mnmo/switch';
import Radio from 'mnmo-components/lib/themes/mnmo/radio';

export default (p, a) =>
<Drawer>
    <List>
        <LI>
            <Switch 
                id="autoUpdateToggle" 
                onChange={a.autoUpdateChange}
                isItem={true}
                checked={p.user.autoUpdate}
            >
                {p.messages.settings.autoUpdate}
            </Switch>
        </LI>
    </List>
    <List>
    {p.country.options.map( (country, key) => (
        <LI key={key}>
            <Radio 
                name="settings-language"
                id={'settings-language-' + key}
                value={country.id}
                checked={(country.id === p.user.languageID)}
                isItem={true}
                onChange={a.languageSettingChange}
            >
                {p.messages.settings.languages[country.lang]}
            </Radio>
        </LI>
    ))}
    </List>
    <List>
        <LI>
        </LI>
        <LI>
            <a style={{color: '#000'}}onClick={a.logoutClick}>
                {p.messages.settings.logout}
            </a>
        </LI>
    </List>
</Drawer>;
