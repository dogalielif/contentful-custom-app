import { useEffect, useState } from "react";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import {MultipleEntryReferenceEditor} from '@contentful/field-editor-reference'
import {Button, Menu, Checkbox, Spinner, DisplayText, Text } from '@contentful/f36-components';
import { ChevronDownIcon } from '@contentful/f36-icons';
import { useSDK } from "@contentful/react-apps-toolkit";

interface FieldProps {
  sdk: FieldExtensionSDK;
}

const Field = (props: FieldProps) => {
  const sdk = useSDK<FieldExtensionSDK>();
  const [options, setOptions] = useState<any>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const locale = sdk.field.locale;

  const getEntries = async (sdk: FieldExtensionSDK) => {
    const result = await sdk.space.getEntries({content_type: 'configDisplayOptions', 'fields.types.en-US': sdk.contentType.sys.id});
    setOptions(result.items);
  }

  useEffect(() => {
    console.log(options);
    if(options.length) setLoading(false);
  }, [options]);

  useEffect(() => {
    sdk.window.startAutoResizer();
  });
  
  useEffect(() => {
    if(sdk) {
      const initialValues = sdk.field.getValue();
      if(initialValues && initialValues.length) {
        setChecked([...initialValues].map((item) => item?.sys?.id));
      }
      getEntries(sdk);
    }
  }, []);

  const onClickCallback = (e: any, id: string) => {
    const checkedIndex = checked.indexOf(id); 
    if(checkedIndex < 0) {
      setChecked([...checked, id]);
    } else {
      const toUpdate = [...checked]
      toUpdate.splice(checkedIndex, 1);
      setChecked(toUpdate);
    }
  }

  if(loading) {
      return <div style={{minHeight:'100px', display:'flex', alignItems: 'center', flexDirection: 'column'}}><Spinner variant="default" size="large" /><DisplayText style={{fontSize: '1rem'}} >Loading Display Options</DisplayText></div>
  }

  const addEntries = () => {
    console.log(checked);
    const newValues = checked.map((item: any) => (
        {
          "sys": {
            "type": "Link",
            "linkType": "Entry",
            "id": item
          }
        }
    ))
    sdk.field.setValue([...newValues]);
  }

  const addDisplayOptions = () => {
    return (
      <div style={{height: 'fit-content', width: '100%', marginBottom: '1rem'}}>
      <Menu closeOnSelect={false} isFullWidth={true} onClose={addEntries} onOpen={() => {
        console.log('on open')
        sdk.window.updateHeight()
        }}>
        <Menu.Trigger> 
         <Button isFullWidth endIcon={<ChevronDownIcon />}>Add/Remove Display Options</Button>
        </Menu.Trigger>
        <Menu.List style={{overflowX:'hidden', maxHeight: '150px', padding: 0}}> 
          {options.map((option: any, index: number) => (
            <Menu.Item style={{overflowX:'hidden', padding: 0}} key={option.sys.id + '-' + index}>
               {/* <EntryCard
                  contentType="Config - Display Options"
                  title={option?.fields?.name?.[locale] ?? ' '}
                  description={option?.fields?.value?.[locale] ?? ' '}
                  onClick={(e: any) => onClickCallback(e, option.sys.id)}
                /> */}
              <Checkbox
                style={{width: '100%', padding: '0.5rem', height: '100%'}}
                key={`${option.sys.id} + '-' + ${index}`}
                name={`${option.sys.id} + '-' + ${index}`}
                id={`${option.sys.id} + '-' + ${index}`}
                value={option.sys.id}
                isChecked={checked.includes(option.sys.id)}
                onChange={(e: any) => onClickCallback(e, option.sys.id)}
              >
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                   <Text fontSize="fontSizeL" lineHeight="lineHeightL">{option?.fields?.name?.[locale] ?? ' '}</Text>
                   <Text fontSize="fontSizeM" lineHeight="lineHeightM">{option?.fields?.value?.[locale] ?? ' '}</Text>
                </div>
              </Checkbox>
            </Menu.Item>
          ))}
        </Menu.List>
      </Menu>
      </div>
    )
  }

  sdk.field.onValueChanged(() => {
    sdk.window.updateHeight();
  })

  return (
    <div style={{minHeight: '200px', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'flex-end', height: 'fit-content', paddingRight: '1rem'}}>
      <MultipleEntryReferenceEditor 
        viewType="card" 
        sdk={sdk}  
        isInitiallyDisabled={true}
        hasCardMoveActions={true}
        hasCardRemoveActions={false}
        parameters={{
          instance: {
            showCreateEntityAction: false,
            showLinkEntityAction: false,
            bulkEditing: false
          }
        }}
        renderCustomActions={(renderCustomActionsProps) => {
          return addDisplayOptions()
        }}
        hasCardEditActions={true}
      />
    </div>
  );
};

export default Field;