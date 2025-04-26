import { VscColorMode } from "react-icons/vsc";
import { IoHelpCircleOutline } from "react-icons/io5";
import { Flex, Text, IconButton, Popover, Portal, Kbd } from "@chakra-ui/react";
import { osName } from "react-device-detect";
import { useColorMode } from "../components/ui/color-mode"

const hotKeys = [
  {
    key: 'P',
    meaning: 'π'
  },
  {
    key: 'S',
    meaning: 'sin'
  },
  {
    key: 'C',
    meaning: 'cos'
  },
  {
    key: 'T',
    meaning: 'tan'
  },
  {
    key: 'L',
    meaning: 'ln'
  },
  {
    key: 'G',
    meaning: 'log'
  },
  {
    key: 'Q',
    meaning: '√'
  }
]

function Header() {
  const { toggleColorMode } = useColorMode()

  return (
    <Flex justifyContent={'space-between'} padding={'12px 24px'} alignItems={'center'}>
      <Text fontSize={'2xl'}>Calculator</Text>
      <Flex gap={'16px'}>
        <Popover.Root>
        <Popover.Trigger asChild>
          <IconButton variant="outline">
            <IoHelpCircleOutline />
          </IconButton>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Arrow />
              <Popover.Body>
                <Popover.Title fontWeight="600" fontSize={20}>Hot Keys</Popover.Title>
                {hotKeys.map((i) => {
                  return <Text my="4" key={hotKeys.indexOf(i)}>
                    {osName === 'Mac OS' ? <Kbd>⌘</Kbd> : <Kbd>Ctrl</Kbd>} + <Kbd>{i.key}</Kbd> → {i.meaning}
                  </Text>
                })}
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
      <IconButton variant="outline" onClick={toggleColorMode} aria-label="Toggle Color Mode">
        <VscColorMode />
      </IconButton>
      </Flex>
    </Flex>
  )
}

export default Header